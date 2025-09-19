import { useState, useEffect, useRef } from "react";
import { DateRange } from "react-date-range";
import { addDays, differenceInCalendarDays, format } from "date-fns";
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
  const currentYear = today.getFullYear();
  const minStart = addDays(today, 3);
  const calendarRef = useRef(null);

  const [showCalendar, setShowCalendar] = useState(false);

  const [filters, setFilters] = useState({
    priceMin: Number(initialValues.priceMin) || 0,
    priceMax: Number(initialValues.priceMax) || maxPrice,
    withCaptain: initialValues.withCaptain || "",
    capacityMin: Number(initialValues.capacityMin) || 0,
    yearRange: [
      Number(initialValues.yearMin) || 1980,
      Number(initialValues.yearMax) || currentYear,
    ],
    cabinsMin: Number(initialValues.cabinsMin) || 0,
    lengthMin: Number(initialValues.lengthMin) || 3,
    startDate: initialValues.startDate
      ? new Date(initialValues.startDate)
      : minStart,
    endDate: initialValues.endDate
      ? new Date(initialValues.endDate)
      : addDays(minStart, 3),
  });

  // uždarom kalendorių paspaudus už ribų
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceMax: prev.priceMax > maxPrice ? maxPrice : prev.priceMax,
      capacityMin:
        prev.capacityMin > maxCapacity ? maxCapacity : prev.capacityMin,
    }));
  }, [maxPrice, maxCapacity]);

  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);

    const cleaned = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "" && v != null)
    );

    if (cleaned.startDate)
      cleaned.startDate = format(cleaned.startDate, "yyyy-MM-dd");
    if (cleaned.endDate)
      cleaned.endDate = format(cleaned.endDate, "yyyy-MM-dd");

    if (Array.isArray(cleaned.yearRange)) {
      cleaned.yearMin = cleaned.yearRange[0];
      cleaned.yearMax = cleaned.yearRange[1];
      delete cleaned.yearRange;
    }

    // 💡 Perrašom tik tuos laukus, kuriuos valdome
    for (const key of Object.keys(cleaned)) {
      currentParams.set(key, cleaned[key]);
    }

    // 💡 Ištrinam laukus, kurie buvo tušti (kad jų neliktų URL)
    const controlledKeys = [
      "priceMin",
      "priceMax",
      "withCaptain",
      "capacityMin",
      "yearMin",
      "yearMax",
      "cabinsMin",
      "lengthMin",
      "startDate",
      "endDate",
    ];

    controlledKeys.forEach((key) => {
      if (!(key in cleaned)) currentParams.delete(key);
    });

    // iškviečiam parent callback su NAUJAIS parametrais
    onChange(Object.fromEntries(currentParams.entries()));
  }, [filters]);

  const handleDateChange = (item) => {
    let { startDate, endDate } = item.selection;
    if (differenceInCalendarDays(endDate, startDate) < 3) {
      endDate = addDays(startDate, 3);
    }
    setFilters((prev) => ({ ...prev, startDate, endDate }));
  };

  const formatDate = (date) => date.toISOString().slice(0, 10);

  return (
    <div className="p-3 border rounded bg-light">
      <h5 className="mb-3">Filter</h5>

      {/* Datos pasirinkimas */}
      <div className="mb-3 position-relative d-block d-md-none">
        <label className="form-label">Date range</label>
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
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Year range slider */}
      <div className="mb-3">
        <label className="form-label d-flex justify-content-between">
          <span>Year</span>
          <span>
            {filters.yearRange[0]} – {filters.yearRange[1]}
          </span>
        </label>
        <Slider
          range
          min={1980}
          max={currentYear}
          value={filters.yearRange}
          onChange={(val) =>
            setFilters((prev) => ({ ...prev, yearRange: val }))
          }
          trackStyle={[{ backgroundColor: "#45CAD1" }]}
          handleStyle={[
            { borderColor: "#45CAD1", backgroundColor: "#45CAD1" },
            { borderColor: "#45CAD1", backgroundColor: "#45CAD1" },
          ]}
        />
      </div>

      {/* Length slider */}
      <div className="mb-3">
        <label className="form-label d-flex justify-content-between">
          <span>Length (m)</span>
          <span>{filters.lengthMin}+</span>
        </label>
        <Slider
          min={3}
          max={25}
          step={0.5}
          value={filters.lengthMin}
          onChange={(val) =>
            setFilters((prev) => ({ ...prev, lengthMin: val }))
          }
          trackStyle={[{ backgroundColor: "#45CAD1" }]}
          handleStyle={[{ borderColor: "#45CAD1", backgroundColor: "#45CAD1" }]}
        />
      </div>

      {/* Price slider */}
      <div className="mb-3">
        <label className="form-label d-flex justify-content-between">
          <span>Price per day (€)</span>
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
          trackStyle={[{ backgroundColor: "#45CAD1" }]}
          handleStyle={[
            { borderColor: "#45CAD1", backgroundColor: "#45CAD1" },
            { borderColor: "#45CAD1", backgroundColor: "#45CAD1" },
          ]}
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
        <label className="form-check-label">With captain only</label>
      </div>

      {/* Capacity slider */}
      <div className="mb-3">
        <label className="form-label d-flex justify-content-between">
          <span>Max people</span>
          <span>{filters.capacityMin}+</span>
        </label>
        <Slider
          min={0}
          max={maxCapacity}
          value={filters.capacityMin}
          onChange={(val) =>
            setFilters((prev) => ({ ...prev, capacityMin: val }))
          }
          trackStyle={[{ backgroundColor: "#45CAD1" }]}
          handleStyle={[{ borderColor: "#45CAD1", backgroundColor: "#45CAD1" }]}
        />
      </div>

      {/* Cabins slider */}
      <div className="mb-3">
        <label className="form-label d-flex justify-content-between">
          <span>Min cabins</span>
          <span>{filters.cabinsMin}+</span>
        </label>
        <Slider
          min={0}
          max={10}
          value={filters.cabinsMin}
          onChange={(val) =>
            setFilters((prev) => ({ ...prev, cabinsMin: val }))
          }
          trackStyle={[{ backgroundColor: "#45CAD1" }]}
          handleStyle={[{ borderColor: "#45CAD1", backgroundColor: "#45CAD1" }]}
        />
      </div>
    </div>
  );
}
