import { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import {
  addDays,
  differenceInCalendarDays,
  format,
  isBefore,
  isAfter,
  parseISO,
} from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../styles/SearchBar.css";

export default function SearchBar({ showButton = true, onFiltersChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date();
  const minStart = addDays(today, 3);

  const searchParams = new URLSearchParams(location.search);
  const typeFromUrl = searchParams.get("type") || "";
  const withCaptainFromUrl = searchParams.get("withCaptain") === "true";
  const startFromUrl = searchParams.get("startDate")
    ? parseISO(searchParams.get("startDate") + "T00:00:00")
    : null;
  const endFromUrl = searchParams.get("endDate")
    ? parseISO(searchParams.get("endDate") + "T00:00:00")
    : null;

  const [type, setType] = useState(typeFromUrl);
  const [withCaptain, setWithCaptain] = useState(withCaptainFromUrl);
  const [dateRange, setDateRange] = useState([
    { startDate: startFromUrl, endDate: endFromUrl, key: "selection" },
  ]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectingStart, setSelectingStart] = useState(false);
  const [dateInputValue, setDateInputValue] = useState(
    startFromUrl && endFromUrl
      ? `${format(startFromUrl, "yyyy-MM-dd")} → ${format(
          endFromUrl,
          "yyyy-MM-dd"
        )}`
      : "When do you want to start?"
  );
  const [monthsToShow, setMonthsToShow] = useState(1);

  const buildParams = (updated = {}) => {
    // paimam esamus parametrus iš URL
    const currentParams = new URLSearchParams(location.search);

    // atnaujinam tik tuos, kuriuos valdo SearchBar
    if ("type" in updated || type) {
      if (updated.type || type) {
        currentParams.set("type", updated.type ?? type);
      } else {
        currentParams.delete("type");
      }
    }

    if ("withCaptain" in updated || withCaptain) {
      if (updated.withCaptain ?? withCaptain) {
        currentParams.set("withCaptain", true);
      } else {
        currentParams.delete("withCaptain");
      }
    }

    if ("startDate" in updated || dateRange[0].startDate) {
      if (updated.startDate || dateRange[0].startDate) {
        currentParams.set(
          "startDate",
          format(updated.startDate ?? dateRange[0].startDate, "yyyy-MM-dd")
        );
      } else {
        currentParams.delete("startDate");
      }
    }

    if ("endDate" in updated || dateRange[0].endDate) {
      if (updated.endDate || dateRange[0].endDate) {
        currentParams.set(
          "endDate",
          format(updated.endDate ?? dateRange[0].endDate, "yyyy-MM-dd")
        );
      } else {
        currentParams.delete("endDate");
      }
    }

    return currentParams;
  };

  const handleDateChange = (item) => {
    let { startDate, endDate } = item.selection;
    if (selectingStart) {
      if (differenceInCalendarDays(endDate, startDate) < 3) {
        endDate = addDays(startDate, 3);
      }
      setDateRange([{ startDate, endDate, key: "selection" }]);
      setShowCalendar(false);
      setSelectingStart(false);
      setDateInputValue(
        `${format(startDate, "yyyy-MM-dd")} → ${format(endDate, "yyyy-MM-dd")}`
      );

      if (onFiltersChange) {
        const params = buildParams({ startDate, endDate });
        onFiltersChange(Object.fromEntries(params.entries()));
      }
    } else {
      setDateRange([{ startDate, endDate: null, key: "selection" }]);
      setSelectingStart(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!dateRange[0].startDate || !dateRange[0].endDate) {
      alert("Please select a start and end date.");
      return;
    }

    const params = buildParams();
    navigate(`/boats?${params.toString()}`);
  };

  useEffect(() => {
    const handleResize = () => {
      setMonthsToShow(window.matchMedia("(min-width: 992px)").matches ? 2 : 1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dinaminės klasės pagal showButton
  const boatTypeCol = showButton ? "col-lg-4" : "col-lg-5";
  const dateCol = showButton ? "col-lg-4" : "col-lg-5";
  const skipperCol = "col-lg-2";

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="row g-3 align-items-center">
        {/* Boat Type */}
        <div className={`col-12 col-md-6 ${boatTypeCol}`}>
          <div className="input-group">
            <span className="input-group-text">🚤</span>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                if (onFiltersChange) {
                  const params = buildParams({ type: e.target.value });
                  onFiltersChange(Object.fromEntries(params.entries()));
                }
              }}
              className="form-select"
            >
              <option value="" disabled hidden>
                Boat Type
              </option>
              <option value="Catamaran">Catamaran</option>
              <option value="Sailing Yacht">Sailing Yacht</option>
              <option value="Speed Boat">Speed Boat</option>
              <option value="Small Boat">Small Boat</option>
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className={`col-12 col-md-6 ${dateCol}`}>
          <div className="date-picker-wrapper input-group">
            <span className="input-group-text">📅</span>
            <input
              type="text"
              readOnly
              value={dateInputValue}
              className="form-control"
              onClick={() => setShowCalendar((prev) => !prev)}
            />
            {showCalendar && (
              <div
                className={`calendar-popup ${
                  showButton ? "popup-top" : "popup-bottom"
                }`}
              >
                <DateRange
                  ranges={[
                    {
                      startDate: dateRange[0].startDate ?? minStart,
                      endDate:
                        dateRange[0].endDate ??
                        dateRange[0].startDate ??
                        addDays(minStart, 3),
                      key: "selection",
                    },
                  ]}
                  onChange={handleDateChange}
                  minDate={minStart}
                  rangeColors={["#0d6efd"]}
                  dateDisplayFormat="yyyy-MM-dd"
                  moveRangeOnFirstSelection={false}
                  showMonthArrows={false}
                  showDateDisplay={false}
                  months={monthsToShow}
                  direction="horizontal"
                  fixedHeight={true}
                  preventSnapRefocus={true}
                  disabledDay={(day) =>
                    selectingStart && dateRange[0].startDate
                      ? isBefore(day, dateRange[0].startDate) ||
                        isAfter(day, addDays(dateRange[0].startDate, 13))
                      : false
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Skipper */}
        <div className={`col-12 col-md-6 ${skipperCol} mx-auto`}>
          <div className="form-check form-switch d-flex align-items-center justify-content-center gap-2 text-white">
            <input
              className="form-check-input"
              type="checkbox"
              id="withCaptain"
              checked={withCaptain}
              onChange={() => {
                const newVal = !withCaptain;
                setWithCaptain(newVal);
                if (onFiltersChange) {
                  const params = buildParams({ withCaptain: newVal });
                  onFiltersChange(Object.fromEntries(params.entries()));
                }
              }}
            />
            <label className="form-check-label mb-0" htmlFor="withCaptain">
              With skipper
            </label>
          </div>
        </div>

        {/* Search Button */}
        {showButton && (
          <div className="col-12 col-md-6 col-lg-2 d-grid">
            <button type="submit" className="button">
              Search
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
