import { useState } from "react";
import { DateRange } from "react-date-range";
import { addDays, differenceInCalendarDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function Home() {
  const today = new Date();
  const minStart = addDays(today, 3);

  const [dateRange, setDateRange] = useState([
    {
      startDate: minStart,
      endDate: addDays(minStart, 3),
      key: "selection",
    },
  ]);

  const [type, setType] = useState("");

  const handleDateChange = (item) => {
    let { startDate, endDate } = item.selection;

    // Jei intervalas per trumpas, automatiškai pailginam iki 3 d.
    if (differenceInCalendarDays(endDate, startDate) < 3) {
      endDate = addDays(startDate, 3);
    }

    setDateRange([
      {
        ...item.selection,
        startDate,
        endDate,
      },
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Paieškos kriterijai:", {
      type,
      startDate: dateRange[0].startDate.toISOString(),
      endDate: dateRange[0].endDate.toISOString(),
    });

    // čia vėliau kviesim GET /api/boats/search su filtrais
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Raskite savo laivą</h1>
      <form className="row g-3 justify-content-center" onSubmit={handleSubmit}>
        {/* Laivo tipas */}
        <div className="col-md-4">
          <label className="form-label">Laivo tipas</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="form-select"
          >
            <option value="">Visi</option>
            <option value="katamaranas">Katamaranas</option>
            <option value="jachta">Jachta</option>
            <option value="motorinis">Motorinis</option>
            <option value="valtis">Valtis</option>
          </select>
        </div>

        {/* Datos pasirinkimas */}
        <div className="col-md-8">
          <label className="form-label d-block">Pasirinkite datas</label>
          <DateRange
            editableDateInputs={true}
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            minDate={minStart}
            rangeColors={["#0d6efd"]}
            dateDisplayFormat="yyyy-MM-dd"
          />
        </div>

        <div className="col-12 text-center mt-3">
          <button type="submit" className="btn btn-primary px-5">
            Ieškoti
          </button>
        </div>
      </form>
    </div>
  );
}
