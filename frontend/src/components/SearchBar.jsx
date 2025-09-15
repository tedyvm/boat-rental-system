import { useState } from "react";
import { DateRange } from "react-date-range";
import { addDays, differenceInCalendarDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../styles/SearchBar.css";

export default function SearchBar({ onSearch }) {
  const navigate = useNavigate();
  const today = new Date();
  const minStart = addDays(today, 3);

  const [dateRange, setDateRange] = useState([
    { startDate: minStart, endDate: addDays(minStart, 3), key: "selection" },
  ]);
  const [type, setType] = useState("");
  const [withCaptain, setWithCaptain] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateChange = (item) => {
    let { startDate, endDate } = item.selection;
    if (differenceInCalendarDays(endDate, startDate) < 3) {
      endDate = addDays(startDate, 3);
    }
    setDateRange([{ ...item.selection, startDate, endDate }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const filters = {};

    if (type) filters.type = type;
    if (withCaptain) filters.withCaptain = true;
    if (dateRange[0].startDate)
      filters.startDate = dateRange[0].startDate.toISOString();
    if (dateRange[0].endDate)
      filters.endDate = dateRange[0].endDate.toISOString();

    const queryString = new URLSearchParams(filters).toString();

    navigate(`/boats?${queryString}`);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="row g-3 align-items-center">
        {/* Boat Type */}
        <div className="col-12 col-md-6 col-lg-4">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="form-select"
          >
            <option value="">Boat Type</option>
            <option value="katamaranas">Catamaran</option>
            <option value="jachta">Sailing Yacht</option>
            <option value="motorinis">Motor Boat</option>
            <option value="valtis">Small Boat</option>
          </select>
        </div>

        {/* Dates */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="date-picker-wrapper">
            <input
              type="text"
              readOnly
              value={`${dateRange[0].startDate
                .toISOString()
                .slice(0, 10)} → ${dateRange[0].endDate
                .toISOString()
                .slice(0, 10)}`}
              className="form-control"
              onClick={() => setShowCalendar((prev) => !prev)}
            />
            {showCalendar && (
              <div className="calendar-popup">
                <DateRange
                  ranges={dateRange}
                  onChange={handleDateChange}
                  minDate={minStart}
                  rangeColors={["#0d6efd"]}
                  dateDisplayFormat="yyyy-MM-dd"
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
