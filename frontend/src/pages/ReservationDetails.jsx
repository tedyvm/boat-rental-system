import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ReservationDetails() {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/reservations/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Reservation not found");
        const data = await res.json();
        setReservation(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservation();
  }, [id, token]);

  if (loading) return <p>Loading reservation...</p>;
  if (!reservation) return <p className="text-danger">Reservation not found</p>;

  async function handleCancel() {
    if (!window.confirm("Are you sure you want to cancel this reservation?"))
      return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/reservations/${reservation._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to cancel reservation");

      const data = await res.json();
      setReservation(data.reservation);
      alert("Reservation cancelled successfully.");
      navigate("/reservations/me");
    } catch (err) {
      console.error(err);
      alert("Could not cancel reservation");
    }
  }

  function handleEdit() {
    // Paprastas variantas – nukreipti į atskirą redagavimo puslapį
    navigate(`/my-orders/${reservation._id}/edit`);
  }

  return (
    <div className="container mt-4">
      <button className="btn btn-link mb-3" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>Reservation Details</h2>

      <div className="card p-3 shadow-sm">
        <h4>{reservation.boat?.name}</h4>
        <p>
          <strong>Type:</strong> {reservation.boat?.type}
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(reservation.startDate).toLocaleDateString()}
        </p>
        <p>
          <strong>End Date:</strong>{" "}
          {new Date(reservation.endDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`badge ${
              reservation.status === "approved"
                ? "bg-success"
                : reservation.status === "pending"
                ? "bg-warning text-dark"
                : "bg-secondary"
            }`}
          >
            {reservation.status}
          </span>
        </p>
        {reservation.note && (
          <p>
            <strong>Note:</strong> {reservation.note}
          </p>
        )}
        {reservation.status === "pending" && (
          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-warning" onClick={handleEdit}>
              Edit Reservation
            </button>
            <button className="btn btn-danger" onClick={handleCancel}>
              Cancel Reservation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
