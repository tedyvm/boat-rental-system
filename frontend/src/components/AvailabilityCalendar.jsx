import { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function AvailabilityCalendar({
  boatId,
  startDate,
  endDate,
  onChange,
  excludeRange, // <-- naujas prop
}) {
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/boats/${boatId}/booked-dates`
        );
        const data = await res.json();
        setBookedDates(data);
      } catch (err) {
        console.error("Failed to fetch booked dates", err);
      }
    };
    fetchBookedDates();
  }, [boatId]);

  const selectionRange = {
    startDate: startDate || new Date(),
    endDate: endDate || new Date(),
    key: "selection",
  };

  // Pagalbinė funkcija: patikrinti ar data yra dabartinės rezervacijos intervale
  const isInExcludeRange = (date) => {
    if (!excludeRange) return false;
    const start = new Date(excludeRange[0]);
    const end = new Date(excludeRange[1]);
    return date >= start && date <= end;
  };

  const isDateBooked = (date) => {
    return bookedDates.some((range) => {
      const start = new Date(range.startDate);
      const end = new Date(range.endDate);

      // ✅ jeigu excludeRange sutampa su šia rezervacija – praleidžiam
      if (excludeRange) {
        const excludeStart = new Date(excludeRange[0]);
        const excludeEnd = new Date(excludeRange[1]);
        if (
          start.getTime() === excludeStart.getTime() &&
          end.getTime() === excludeEnd.getTime()
        ) {
          return false; // neblokuojam šio intervalo
        }
      }

      return date >= start && date <= end;
    });
  };

  return (
    <DateRange
      ranges={[selectionRange]}
      onChange={(ranges) =>
        onChange([ranges.selection.startDate, ranges.selection.endDate])
      }
      minDate={new Date()}
      disabledDay={(date) => isDateBooked(date)}
      rangeColors={["#0d6efd"]}
      moveRangeOnFirstSelection={false}
      editableDateInputs={true}
    />
  );
}
