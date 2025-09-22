import { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../styles/SearchBar.css";

export default function SearchBar({
  filters = {},
  onChange,
  onSearch,
  showButton = true,
}) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [monthsToShow, setMonthsToShow] = useState(1);

  const startDate = filters.startDate ? new Date(filters.startDate) : null;
  const endDate = filters.endDate ? new Date(filters.endDate) : null;

  const dateInputValue =
    startDate && endDate
      ? `${format(startDate, "yyyy-MM-dd")} → ${format(endDate, "yyyy-MM-dd")}`
      : "Select dates";

  const handleDateChange = (item) => {
    const start = item.selection.startDate;
    const end = item.selection.endDate;

    onChange({
      ...filters,
      startDate: start,
      endDate: end,
    });

    // Uždaryti tik kai vartotojas pasirinko kitą dieną (ne tą pačią)
    if (start && end && start.getTime() !== end.getTime()) {
      setShowCalendar(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  useEffect(() => {
    if (!showButton && onSearch) {
      onSearch();
    }
  }, [filters, showButton, onSearch]);

  useEffect(() => {
    const handleResize = () => {
      setMonthsToShow(window.matchMedia("(min-width: 992px)").matches ? 2 : 1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const boatTypeCol = showButton ? "col-lg-4" : "col-12 col-lg-5";
  const dateCol = showButton ? "col-lg-4" : "col-12 col-lg-5";
  const skipperCol = "col-lg-2 col-12";

  return (
    <form className="search-bar px-2 p-md-0" onSubmit={handleSubmit}>
      <div className="row g-3 align-items-center">
        {/* Boat Type */}
        <div className={`col-12 col-md-6 ${boatTypeCol}`}>
          <div className="input-group">
            <span className="input-group-text">🚤</span>
            <select
              value={filters.type || ""}
              onChange={(e) => onChange({ ...filters, type: e.target.value })}
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
                      startDate: startDate ?? new Date(),
                      endDate: endDate ?? new Date(),
                      key: "selection",
                    },
                  ]}
                  minDate={new Date()}
                  onChange={handleDateChange}
                  rangeColors={["#0d6efd"]}
                  dateDisplayFormat="yyyy-MM-dd"
                  moveRangeOnFirstSelection={false}
                  showMonthArrows={false}
                  showDateDisplay={false}
                  months={monthsToShow}
                  direction="horizontal"
                  fixedHeight={true}
                  preventSnapRefocus={true}
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
              checked={
                filters.withCaptain === true || filters.withCaptain === "true"
              }
              onChange={(e) =>
                onChange({ ...filters, withCaptain: e.target.checked })
              }
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
