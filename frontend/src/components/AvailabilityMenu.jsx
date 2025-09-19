import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { DateRange } from "react-date-range";
import { addDays, format, eachDayOfInterval, differenceInCalendarDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../styles/Availability.css";

export default function AvailabilityMenu({ onReserve, pricePerDay }) {
  const { id: boatId } = useParams();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const initialStart = searchParams.get("startDate")
    ? new Date(searchParams.get("startDate"))
    : null;
  const initialEnd = searchParams.get("endDate")
    ? new Date(searchParams.get("endDate"))
    : null;

  const [range, setRange] = useState([
    { startDate: initialStart, endDate: initialEnd, key: "selection" },
  ]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [disabledDates, setDisabledDates] = useState([]);

  useEffect(() => {
    async function fetchBookedDates() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/boats/${boatId}/booked-dates`
        );
        if (!res.ok) throw new Error("Failed to fetch booked dates");
        const data = await res.json();

        const allDisabled = data.flatMap((b) =>
          eachDayOfInterval({
            start: new Date(b.startDate),
            end: new Date(b.endDate),
          })
        );

        setDisabledDates(allDisabled);
      } catch (err) {
        console.error("Failed to load booked dates:", err);
      }
    }

    if (boatId) fetchBookedDates();
  }, [boatId]);

  const handleDateChange = (item) => {
    let { startDate, endDate } = item.selection;

    if (differenceInCalendarDays(endDate, startDate) < 3) {
      endDate = addDays(startDate, 3);
    }

    setRange([{ startDate, endDate, key: "selection" }]);
  };

  const handleReserveClick = () => {
    if (!range[0].startDate || !range[0].endDate) {
      alert("Please select a date range!");
      return;
    }
    onReserve?.({
      startDate: format(range[0].startDate, "yyyy-MM-dd"),
      endDate: format(range[0].endDate, "yyyy-MM-dd"),
    });
  };

 
  const totalDays =
    range[0].startDate && range[0].endDate
      ? differenceInCalendarDays(range[0].endDate, range[0].startDate)
      : 0;
  const totalPrice = totalDays * (pricePerDay || 0);

  return (
    <div className="p-3">
      <div className="mb-3">
        <label className="form-label fw-bold ">Select dates</label>
        <input
          type="text"
          className="form-control"
          readOnly
          value={
            range[0].startDate && range[0].endDate
              ? `${format(range[0].startDate, "yyyy-MM-dd")} → ${format(
                  range[0].endDate,
                  "yyyy-MM-dd"
                )}`
              : "Select dates"
          }
          onClick={() => setShowCalendar((prev) => !prev)}
        />

        {showCalendar && (
          <div className="position-relative">
            <div
              className="position-absolute bg-white border rounded shadow p-2"
              style={{ zIndex: 1000 }}
            >
              <DateRange
                editableDateInputs
                moveRangeOnFirstSelection={false}
                ranges={range}
                onChange={handleDateChange}
                minDate={addDays(new Date(), 1)}
                rangeColors={["#0d6efd"]}
                disabledDates={disabledDates}
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
          </div>
        )}
      </div>

      {totalDays > 0 && (
        <div className="text-center mb-3">
          <p className="mb-1">
            <strong>{totalDays}</strong> days selected
          </p>
          <p className="mb-0">
            Total: <strong>{totalPrice} €</strong>
          </p>
        </div>
      )}

      <button className="btn btn-primary w-100" onClick={handleReserveClick}>
        Reserve
      </button>
    </div>
  );
}
