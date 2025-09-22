import { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function BoatFilters({
  filters,
  onChange,
  maxPrice = 2000,
  maxCapacity = 20,
}) {
  const today = new Date();
  const currentYear = today.getFullYear();

  // Lokalus state slideriams
  const [yearRange, setYearRange] = useState([
    Number(filters.yearMin ?? 1980),
    Number(filters.yearMax ?? currentYear),
  ]);
  const [length, setLength] = useState(Number(filters.lengthMin ?? 3));
  const [priceRange, setPriceRange] = useState([
    Number(filters.priceMin ?? 0),
    Number(filters.priceMax ?? maxPrice),
  ]);
  const [capacity, setCapacity] = useState(Number(filters.capacityMin ?? 0));
  const [cabins, setCabins] = useState(Number(filters.cabinsMin ?? 0));
  const [rating, setRating] = useState(Number(filters.ratingMin ?? 0));

  // Kai filters iš tėvo pasikeičia (pvz. URL pasikeitė), atnaujinam lokalius state
  useEffect(() => {
    setYearRange([
      Number(filters.yearMin ?? 1980),
      Number(filters.yearMax ?? currentYear),
    ]);
    setLength(Number(filters.lengthMin ?? 3));
    setPriceRange([
      Number(filters.priceMin ?? 0),
      Number(filters.priceMax ?? maxPrice),
    ]);
    setCapacity(Number(filters.capacityMin ?? 0));
    setCabins(Number(filters.cabinsMin ?? 0));
    setRating(Number(filters.ratingMin ?? 0));
  }, [filters, currentYear, maxPrice]);

  return (
    <div className="p-3 border rounded bg-light">
      <h5 className="mb-3">Filter</h5>

      {/* Year range slider */}
      <div className="mb-3">
        <label className="form-label d-flex justify-content-between">
          <span>Year</span>
          <span>
            {yearRange[0]} – {yearRange[1]}
          </span>
        </label>
        <Slider
          range
          min={1980}
          max={currentYear}
          value={yearRange}
          onChange={(val) => setYearRange(val)}
          onAfterChange={(val) =>
            onChange({ ...filters, yearMin: val[0], yearMax: val[1] })
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
          <span>{length}+</span>
        </label>
        <Slider
          min={3}
          max={25}
          step={0.5}
          value={length}
          onChange={(val) => setLength(val)}
          onAfterChange={(val) => onChange({ ...filters, lengthMin: val })}
          trackStyle={[{ backgroundColor: "#45CAD1" }]}
          handleStyle={[{ borderColor: "#45CAD1", backgroundColor: "#45CAD1" }]}
        />
      </div>

      {/* Price slider */}
      <div className="mb-3">
        <label className="form-label d-flex justify-content-between">
          <span>Price per day (€)</span>
          <span>
            {priceRange[0]} – {priceRange[1]}
          </span>
        </label>
        <Slider
          range
          min={0}
          max={maxPrice}
          step={10}
          value={priceRange}
          onChange={(val) => setPriceRange(val)}
          onAfterChange={(val) =>
            onChange({ ...filters, priceMin: val[0], priceMax: val[1] })
          }
          trackStyle={[{ backgroundColor: "#45CAD1" }]}
          handleStyle={[
            { borderColor: "#45CAD1", backgroundColor: "#45CAD1" },
            { borderColor: "#45CAD1", backgroundColor: "#45CAD1" },
          ]}
        />
      </div>

      {/* Capacity slider */}
      <div className="mb-3">
        <label className="form-label d-flex justify-content-between">
          <span>Max people</span>
          <span>{capacity}+</span>
        </label>
        <Slider
          min={0}
          max={maxCapacity}
          value={capacity}
          onChange={(val) => setCapacity(val)}
          onAfterChange={(val) => onChange({ ...filters, capacityMin: val })}
          trackStyle={[{ backgroundColor: "#45CAD1" }]}
          handleStyle={[{ borderColor: "#45CAD1", backgroundColor: "#45CAD1" }]}
        />
      </div>

      {/* Cabins slider */}
      <div className="mb-3">
        <label className="form-label d-flex justify-content-between">
          <span>Min cabins</span>
          <span>{cabins}+</span>
        </label>
        <Slider
          min={0}
          max={10}
          value={cabins}
          onChange={(val) => setCabins(val)}
          onAfterChange={(val) => onChange({ ...filters, cabinsMin: val })}
          trackStyle={[{ backgroundColor: "#45CAD1" }]}
          handleStyle={[{ borderColor: "#45CAD1", backgroundColor: "#45CAD1" }]}
        />
      </div>

      {/* Rating slider */}
      <div className="mb-3">
        <label className="form-label d-flex justify-content-between">
          <span>Min rating</span>
          <span>{rating}+</span>
        </label>
        <Slider
          min={0}
          max={5}
          value={rating}
          onChange={(val) => setRating(val)}
          onAfterChange={(val) => onChange({ ...filters, ratingMin: val })}
          trackStyle={[{ backgroundColor: "#45CAD1" }]}
          handleStyle={[{ borderColor: "#45CAD1", backgroundColor: "#45CAD1" }]}
        />
      </div>

      {/* Reset button */}
      <div className="d-grid">
        <button type="button" className="button" onClick={() => onChange({})}>
          Reset filters
        </button>
      </div>
    </div>
  );
}
