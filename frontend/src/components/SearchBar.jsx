import { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import {
  addDays,
  differenceInCalendarDays,
  format,
  isBefore,
  isAfter,
} from "date-fns";
import { useNavigate } from "react-router-dom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../styles/SearchBar.css";

export default function SearchBar() {
  const navigate = useNavigate();
  const today = new Date();
  const minStart = addDays(today, 3);

  // 📅 Pradžioje jokių datų – tuščias kalendorius
  const [dateRange, setDateRange] = useState([
    { startDate: null, endDate: null, key: "selection" },
  ]);

  const [type, setType] = useState("");
  const [withCaptain, setWithCaptain] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectingStart, setSelectingStart] = useState(false);
  const [dateInputValue, setDateInputValue] = useState(
    "When do you want to start?"
  );
  const [monthsToShow, setMonthsToShow] = useState(1);

  const handleDateChange = (item) => {
    let { startDate, endDate } = item.selection;

    if (selectingStart) {
      // pasirenkam antrą datą → uždarom
      if (differenceInCalendarDays(endDate, startDate) < 3) {
        endDate = addDays(startDate, 3);
      }
      setDateRange([{ startDate, endDate, key: "selection" }]);
      setShowCalendar(false);
      setSelectingStart(false);
      setDateInputValue(
        `${format(startDate, "yyyy-MM-dd")} → ${format(endDate, "yyyy-MM-dd")}`
      );
    } else {
      // pasirenkam pirmą datą → resetinam endDate
      setDateRange([{ startDate, endDate: null, key: "selection" }]);
      setSelectingStart(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const filters = {};
    if (type) filters.type = type;
    if (withCaptain) filters.withCaptain = true;

    // jei vartotojas nepasirinko datų – sustabdyti submit
    if (!dateRange[0].startDate || !dateRange[0].endDate) {
      alert("Please select a start and end date.");
      return;
    }

    const start = format(dateRange[0].startDate, "yyyy-MM-dd");
    const end = format(dateRange[0].endDate, "yyyy-MM-dd");

    filters.startDate = start;
    filters.endDate = end;

    const queryString = new URLSearchParams(filters).toString();
    navigate(`/boats?${queryString}`);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia("(min-width: 992px)").matches) {
        setMonthsToShow(2);
      } else {
        setMonthsToShow(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="row g-3 align-items-center">
        {/* Boat Type */}
        <div className="col-12 col-md-6 col-lg-4 ">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_708_985)">
                    <path
                      d="M21.3791 15.7575C20.9199 15.4004 20.3078 15.5025 19.9507 15.9106L19.4915 16.4208C18.7773 17.288 17.808 17.339 16.0735 17.288C15.7674 17.288 15.4614 17.288 15.1553 17.288H8.88049C8.5744 17.288 8.26831 17.288 7.96223 17.288C6.27875 17.339 5.25847 17.288 4.54424 16.4208L4.08511 15.9106C3.72799 15.4515 3.06483 15.4004 2.65669 15.7575C2.19755 16.1147 2.14652 16.7778 2.50364 17.186L2.96272 17.6961C4.13604 19.0735 5.71751 19.2776 7.19691 19.2776C7.45197 19.2776 7.70707 19.2776 7.96213 19.2776C8.26822 19.2776 8.52327 19.2776 8.82936 19.2776H15.1552C15.4613 19.2776 15.7674 19.2776 16.0224 19.2776C17.7569 19.3286 19.6955 19.3796 21.0728 17.6961L21.532 17.186C21.8892 16.7268 21.7872 16.1147 21.3791 15.7575Z"
                      fill="black"
                    />
                    <path
                      d="M18.4203 14.2781C18.1142 12.9007 15.8696 3.05493 8.88054 0.0961215C8.57445 -0.00589158 8.21733 -0.00589158 7.96227 0.198135C7.65619 0.351178 7.50314 0.657265 7.50314 1.01438V14.5332C7.50314 15.0943 7.96227 15.5535 8.52342 15.5535H17.502C18.0631 15.5535 18.4712 15.1454 18.4712 14.6352C18.4713 14.4822 18.4713 14.3802 18.4203 14.2781ZM9.54374 13.564V2.64683C13.6249 5.2996 15.5635 11.0642 16.2266 13.564H9.54374Z"
                      fill="black"
                    />
                    <path
                      d="M23.4707 21.8793L21.7872 20.961C20.3588 20.1958 18.7264 20.1958 17.349 20.961L16.9919 21.1651C16.2266 21.5732 15.2573 21.5732 14.4921 21.1651L14.135 20.961C12.7066 20.1958 11.0741 20.1958 9.69675 20.961C8.93153 21.3691 7.96224 21.3691 7.19702 20.961L6.99295 20.859C5.56452 20.0938 3.83006 20.0938 2.40164 20.961L0.514136 22.1344C0.00397463 22.4404 -0.149069 23.0526 0.157018 23.5118C0.361092 23.8178 0.667179 23.9709 1.02425 23.9709C1.17729 23.9709 1.38137 23.9199 1.53441 23.8689L3.42196 22.6956C4.23821 22.1854 5.20745 22.1854 6.0237 22.5935L6.22778 22.6956C7.6562 23.4608 9.28865 23.4608 10.666 22.6956C11.4313 22.2875 12.4005 22.2875 13.1658 22.6956L13.5739 22.8996C15.0023 23.6648 16.6347 23.6648 18.0121 22.8996L18.3692 22.6956C19.1345 22.2875 20.1038 22.2875 20.869 22.6956L22.5014 23.6648C23.0116 23.9199 23.6238 23.7669 23.8788 23.2567C24.1339 22.7466 23.9808 22.1344 23.4707 21.8793Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_708_985">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </i>
            </span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="form-select"
            >
              <option value="" disabled hidden>
                Boat Type
              </option>
              <option value="katamaranas">Catamaran</option>
              <option value="jachta">Sailing Yacht</option>
              <option value="motorinis">Motor Boat</option>
              <option value="valtis">Small Boat</option>
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="date-picker-wrapper input-group">
            <span className="input-group-text">
              <i className="bi bi-search">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16 2V6"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8 2V6"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3 10H21"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </i>
            </span>
            <input
              type="text"
              readOnly
              value={dateInputValue}
              className="form-control"
              onClick={() => setShowCalendar((prev) => !prev)}
            />
            {showCalendar && (
              <div className="calendar-popup">
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
                  rangeColors={["#0dfd6dff"]}
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
        <div className="col-12 col-md-6 col-lg-2">
          <div className="form-check form-switch d-flex align-items-center justify-content-center gap-2 text-white">
            <input
              className="form-check-input"
              type="checkbox"
              id="withCaptain"
              checked={withCaptain}
              onChange={() => setWithCaptain((prev) => !prev)}
            />
            <label className="form-check-label mb-0" htmlFor="withCaptain">
              With skipper
            </label>
          </div>
        </div>

        {/* Search Button */}
        <div className="col-12 col-md-6 col-lg-2 d-grid">
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
