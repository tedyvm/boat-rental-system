import { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../styles/Availability.css";

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

const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const isDateBooked = (date) => {
  const day = normalizeDate(date);

  return bookedDates.some((range) => {
    const start = normalizeDate(range.startDate);
    const end = normalizeDate(range.endDate);

    // ✅ Įskaičiuojam pilną paskutinę dieną
    end.setHours(23, 59, 59, 999);

    if (excludeRange) {
      const excludeStart = normalizeDate(excludeRange[0]);
      const excludeEnd = normalizeDate(excludeRange[1]);
      excludeEnd.setHours(23, 59, 59, 999);

      if (start.getTime() === excludeStart.getTime() &&
          end.getTime() === excludeEnd.getTime()) {
        return false;
      }
    }

    return day >= start && day <= end;
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
