import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AvailabilityCalendar from "../components/AvailabilityCalendar";

export default function ReservationEdit() {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dateRange, setDateRange] = useState([null, null]);
  const [note, setNote] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  // Pagalbinė funkcija – gražina YYYY-MM-DD formatą
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch reservation details on mount
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/reservations/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch reservation");
        const data = await res.json();
        setReservation(data);
        setDateRange([new Date(data.startDate), new Date(data.endDate)]);
        setNote(data.note || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id, token]);

  // Calculate price dynamically
  useEffect(() => {
    if (reservation && dateRange[0] && dateRange[1]) {
      const days =
        (dateRange[1].getTime() - dateRange[0].getTime()) /
        (1000 * 60 * 60 * 24);
      setTotalPrice(days * reservation.boat.pricePerDay);
    }
  }, [dateRange, reservation]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dateRange[0] || !dateRange[1]) {
      alert("Please select both start and end dates.");
      return;
    }

    const start = new Date(dateRange[0]);
    const end = new Date(dateRange[1]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      alert("Start date cannot be in the past.");
      return;
    }

    if (end <= start) {
      alert("End date must be after start date.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          boatId: reservation.boat._id,
          startDate: formatDate(start), // <-- Siunčiam tik YYYY-MM-DD
          endDate: formatDate(end),
          note,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update reservation");
        return;
      }

      const updated = await res.json();
      alert("Reservation updated successfully!");
      navigate(`/reservations/${updated._id}`);
    } catch (err) {
      console.error(err);
      alert("Unexpected error: " + err);
    }
  };

  if (loading) return <p>Loading reservation...</p>;
  if (!reservation) return <p className="text-danger">Reservation not found</p>;

  return (
    <div className="container mt-4">
      <h2>Edit Reservation</h2>
      <div className="card p-3 shadow-sm">
        <h4 className="mb-3">{reservation.boat?.name}</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Select New Dates</label>
            <AvailabilityCalendar
              boatId={reservation.boat._id}
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              excludeRange={[reservation.startDate, reservation.endDate]} // <-- praleidžiam savas datas
              onChange={(range) => setDateRange(range)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Note (optional)</label>
            <textarea
              className="form-control"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional message for admin..."
            />
          </div>

          {dateRange[0] && dateRange[1] && (
            <p className="fw-bold">Total Price: {totalPrice.toFixed(2)} €</p>
          )}

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
