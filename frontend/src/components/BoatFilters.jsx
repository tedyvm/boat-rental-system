import { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function BoatFilters({ filters, onChange }) {
  const currentYear = new Date().getFullYear();

  // Vienas state – visų filtrų min/max ribos
  const [limits, setLimits] = useState(null);

  // Vienas state – vartotojo pasirinktos reikšmės
  const [values, setValues] = useState({
    price: [Number(filters.priceMin ?? 0), Number(filters.priceMax ?? 0)],
    capacity: Number(filters.capacityMin ?? 0),
    year: [
      Number(filters.yearMin ?? 1980),
      Number(filters.yearMax ?? currentYear),
    ],
    length: Number(filters.lengthMin ?? 3),
    cabins: Number(filters.cabinsMin ?? 0),
    rating: Number(filters.ratingMin ?? 0),
  });

  // Fetch limitus iš serverio tik vieną kartą
  useEffect(() => {
    async function fetchLimits() {
      try {
        const res = await fetch(
          "http://localhost:5000/api/boats/filter-limits"
        );
        const data = await res.json();

        setLimits({
          price: { min: data.price.min ?? 0, max: data.price.max ?? 0 },
          capacity: {
            min: data.capacity.min ?? 0,
            max: data.capacity.max ?? 0,
          },
          year: {
            min: data.year.min ?? 1980,
            max: data.year.max ?? currentYear,
          },
          length: { min: data.length.min ?? 3, max: data.length.max ?? 25 },
          cabins: { min: data.cabins.min ?? 0, max: data.cabins.max ?? 10 },
        });

        // Nustatome pradines sliderių reikšmes pagal gautus limitus
        setValues((prev) => ({
          ...prev,
          price: [data.price.min ?? 0, data.price.max ?? 0],
          capacity: data.capacity.min ?? 0,
          year: [data.year.min ?? 1980, data.year.max ?? currentYear],
          length: data.length.min ?? 3,
        }));
      } catch (err) {
        console.error("Nepavyko gauti ribų", err);
      }
    }
    fetchLimits();
  }, []);

  // Kai filters pasikeičia iš tėvo (pvz. dėl URL), atnaujinam lokalias reikšmes
  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      price: [
        Number(filters.priceMin ?? prev.price[0]),
        Number(filters.priceMax ?? prev.price[1]),
      ],
      capacity: Number(filters.capacityMin ?? prev.capacity),
      year: [
        Number(filters.yearMin ?? prev.year[0]),
        Number(filters.yearMax ?? prev.year[1]),
      ],
      length: Number(filters.lengthMin ?? prev.length),
      cabins: Number(filters.cabinsMin ?? prev.cabins),
      rating: Number(filters.ratingMin ?? prev.rating),
    }));
  }, [filters]);

  if (!limits) return <p>Kraunama filtrai...</p>; // Paprastas loading state

  return (
    <div className="p-3 border rounded bg-light">
      <h5 className="mb-3">Filter</h5>

      {/* Year */}
      <div className="mb-3">
        <label className="form-label d-flex justify-content-between">
          <span>Year</span>
          <span>
            {values.year[0]} – {values.year[1]}
          </span>
        </label>
        <Slider
          range
          min={limits.year.min}
          max={limits.year.max}
          value={values.year}
          onChange={(val) => setValues((p) => ({ ...p, year: val }))}
          onChangeComplete={(val) =>
            onChange({ ...filters, yearMin: val[0], yearMax: val[1] })
          }
        />
      </div>

      {/* Length */}
      <div className="mb-3">
        <label className="form-label d-flex justify-content-between">
          <span>Length (m)</span>
          <span>{values.length}+</span>
        </label>
        <Slider
          min={limits.length.min}
          max={limits.length.max}
          step={0.5}
          value={values.length}
          onChange={(val) => setValues((p) => ({ ...p, length: val }))}
          onChangeComplete={(val) => onChange({ ...filters, lengthMin: val })}
        />
      </div>

      {/* Price */}
      <div className="mb-3">
        <label className="form-label d-flex justify-content-between">
          <span>Price per day (€)</span>
          <span>
            {values.price[0]} – {values.price[1]}
          </span>
        </label>
        <Slider
          range
          min={limits.price.min}
          max={limits.price.max}
          step={10}
          value={values.price}
          onChange={(val) => setValues((p) => ({ ...p, price: val }))}
          onChangeComplete={(val) =>
            onChange({ ...filters, priceMin: val[0], priceMax: val[1] })
          }
        />
      </div>

      {/* Capacity */}
      <div className="mb-3">
        <label className="form-label d-flex justify-content-between">
          <span>Max people</span>
          <span>{values.capacity}+</span>
        </label>
        <Slider
          min={limits.capacity.min}
          max={limits.capacity.max}
          value={values.capacity}
          onChange={(val) => setValues((p) => ({ ...p, capacity: val }))}
          onChangeComplete={(val) => onChange({ ...filters, capacityMin: val })}
        />
      </div>

      {/* Cabins */}
      <div className="mb-3">
        <label className="form-label d-flex justify-content-between">
          <span>Min cabins</span>
          <span>{values.cabins}+</span>
        </label>
        <Slider
          min={ limits.cabins.min}
          max={limits.cabins.max}
          value={values.cabins}
          onChange={(val) => setValues((p) => ({ ...p, cabins: val }))}
          onChangeComplete={(val) => onChange({ ...filters, cabinsMin: val })}
        />
      </div>

      {/* Rating */}
      <div className="mb-3">
        <label className="form-label d-flex justify-content-between">
          <span>Min rating</span>
          <span>{values.rating}+</span>
        </label>
        <Slider
          min={0}
          max={5}
          value={values.rating}
          onChange={(val) => setValues((p) => ({ ...p, rating: val }))}
          onChangeComplete={(val) => onChange({ ...filters, ratingMin: val })}
        />
      </div>

      {/* Reset */}
      <div className="d-grid">
        <button type="button" className="button" onClick={() => onChange({})}>
          Reset filters
        </button>
      </div>
    </div>
  );
}
