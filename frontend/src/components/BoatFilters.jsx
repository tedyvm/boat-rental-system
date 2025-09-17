import { useState, useEffect, useRef } from "react";
import { DateRange } from "react-date-range";
import { addDays, differenceInCalendarDays } from "date-fns";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function BoatFilters({
  onChange,
  initialValues = {},
  maxPrice = 2000,
  maxCapacity = 20,
}) {
  const today = new Date();
  const minStart = addDays(today, 3);
  const calendarRef = useRef(null);

  const [showCalendar, setShowCalendar] = useState(false);

  const [filters, setFilters] = useState({
    type: initialValues.type || "",
    priceMin: Number(initialValues.priceMin) || 0,
    priceMax: Number(initialValues.priceMax) || maxPrice,
    withCaptain: initialValues.withCaptain || "",
    capacityMin: Number(initialValues.capacityMin) || 0,
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

  // kai pasikeičia maxPrice/maxCapacity (pvz. filtruotas sąrašas sumažėjo)
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceMax: prev.priceMax > maxPrice ? maxPrice : prev.priceMax,
      capacityMin: prev.capacityMin > maxCapacity ? maxCapacity : prev.capacityMin,
    }));
  }, [maxPrice, maxCapacity]);

  // pranešame tėviniam komponentui apie pokyčius
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

      {/* Datos pasirinkimas */}
      <div className="mb-3 position-relative d-block d-md-none">
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
      <div className="mb-3 d-block d-md-none">
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

      {/* Kainų diapazonas (slider) */}
      <div className="mb-3">
        <label className="form-label d-flex justify-content-between">
          <span>Kaina (€)</span>
          <span>
            {filters.priceMin} – {filters.priceMax}
          </span>
        </label>
        <Slider
          range
          min={0}
          max={maxPrice}
          step={10}
          value={[filters.priceMin, filters.priceMax]}
          onChange={(vals) =>
            setFilters((prev) => ({
              ...prev,
              priceMin: vals[0],
              priceMax: vals[1],
            }))
          }
          trackStyle={[{ backgroundColor: "#0d6efd" }]}
          handleStyle={[
            { borderColor: "#0d6efd", backgroundColor: "#0d6efd" },
            { borderColor: "#0d6efd", backgroundColor: "#0d6efd" },
          ]}
        />
      </div>

      {/* Kapitonas */}
      <div className="form-check mb-3 d-block d-md-none">
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

      {/* Min. vietų (slider) */}
      <div className="mb-3">
        <label className="form-label d-flex justify-content-between">
          <span>Vietos</span>
          <span>{filters.capacityMin}+</span>
        </label>
        <Slider
          min={0}
          max={maxCapacity}
          value={filters.capacityMin}
          onChange={(val) =>
            setFilters((prev) => ({ ...prev, capacityMin: val }))
          }
          trackStyle={[{ backgroundColor: "#0d6efd" }]}
          handleStyle={[{ borderColor: "#0d6efd", backgroundColor: "#0d6efd" }]}
        />
      </div>
    </div>
  );
}
