import { useState, useEffect, useRef } from "react";
import { DateRange } from "react-date-range";
import { addDays, differenceInCalendarDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function BoatFilters({ onChange, initialValues = {} }) {
  const today = new Date();
  const minStart = addDays(today, 3);
  const calendarRef = useRef(null);

  const [showCalendar, setShowCalendar] = useState(false);

  const [filters, setFilters] = useState({
    type: initialValues.type || "",
    priceMin: initialValues.priceMin || "",
    priceMax: initialValues.priceMax || "",
    withCaptain: initialValues.withCaptain || "",
    capacityMin: initialValues.capacityMin || "",
    startDate: initialValues.startDate
      ? new Date(initialValues.startDate)
      : minStart,
    endDate: initialValues.endDate
      ? new Date(initialValues.endDate)
      : addDays(minStart, 3),
  });

  // Uždarom popup paspaudus už ribų
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  useEffect(() => {
    const cleaned = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "" && v != null)
    );
    if (cleaned.startDate) cleaned.startDate = cleaned.startDate.toISOString();
    if (cleaned.endDate) cleaned.endDate = cleaned.endDate.toISOString();
    onChange(cleaned);
  }, [filters]);

  const handleDateChange = (item) => {
    let { startDate, endDate } = item.selection;
    if (differenceInCalendarDays(endDate, startDate) < 3) {
      endDate = addDays(startDate, 3);
    }
    setFilters((prev) => ({
      ...prev,
      startDate,
      endDate,
    }));
  };

  const formatDate = (date) => date.toISOString().slice(0, 10); // yyyy-mm-dd

  return (
    <div className="p-3 border rounded bg-light">
      <h5 className="mb-3">Filtrai</h5>

      {/* Datos pasirinkimas su popup */}
      <div className="mb-3 position-relative">
        <label className="form-label">Datos intervalas</label>
        <div className="d-flex gap-2">
          <input
            type="text"
            readOnly
            className="form-control"
            value={formatDate(filters.startDate)}
            onClick={() => setShowCalendar(true)}
          />
          <input
            type="text"
            readOnly
            className="form-control"
            value={formatDate(filters.endDate)}
            onClick={() => setShowCalendar(true)}
          />
        </div>

        {showCalendar && (
          <div
            ref={calendarRef}
            className="position-absolute bg-white border rounded shadow p-2 mt-1"
            style={{ zIndex: 1000 }}
          >
            <DateRange
              editableDateInputs={true}
              onChange={handleDateChange}
              moveRangeOnFirstSelection={false}
              ranges={[
                {
                  startDate: filters.startDate,
                  endDate: filters.endDate,
                  key: "selection",
                },
              ]}
              minDate={minStart}
              dateDisplayFormat="yyyy-MM-dd"
              rangeColors={["#0d6efd"]}
            />
            <div className="text-end mt-2">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setShowCalendar(false)}
              >
                Gerai
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tipas */}
      <div className="mb-3">
        <label className="form-label">Laivo tipas</label>
        <select
          value={filters.type}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, type: e.target.value }))
          }
          className="form-select"
        >
          <option value="">Visi</option>
          <option value="katamaranas">Katamaranas</option>
          <option value="jachta">Jachta</option>
          <option value="motorinis">Motorinis</option>
          <option value="valtis">Valtis</option>
        </select>
      </div>

      {/* Kaina nuo */}
      <div className="mb-3">
        <label className="form-label">Kaina nuo</label>
        <input
          type="number"
          value={filters.priceMin}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, priceMin: e.target.value }))
          }
          className="form-control"
        />
      </div>

      {/* Kaina iki */}
      <div className="mb-3">
        <label className="form-label">Kaina iki</label>
        <input
          type="number"
          value={filters.priceMax}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, priceMax: e.target.value }))
          }
          className="form-control"
        />
      </div>

      {/* Kapitonas */}
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          checked={filters.withCaptain === "true"}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              withCaptain: e.target.checked ? "true" : "",
            }))
          }
        />
        <label className="form-check-label">Tik su kapitonu</label>
      </div>

      {/* Min. vietų */}
      <div className="mb-3">
        <label className="form-label">Min. vietų</label>
        <input
          type="number"
          value={filters.capacityMin}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, capacityMin: e.target.value }))
          }
          className="form-control"
        />
      </div>
    </div>
  );
}
