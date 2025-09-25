import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/ReservationDetails.css";

export default function ReservationDetails() {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Review state ---
  const [myReview, setMyReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
        if (data.status === "completed") fetchMyReview(data.boat._id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservation();
  }, [id, token]);

  const fetchMyReview = async (boatId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/reviews/boat/${boatId}`
      );
      if (!res.ok) return;
      const reviews = await res.json();
      const mine = reviews.find((r) => r.user?._id === reservation?.user?._id);
      if (mine) {
        setMyReview(mine);
        setRating(mine.rating);
        setComment(mine.comment);
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

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
    navigate(`/reservations/${reservation._id}/edit`);
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!rating) return alert("Please select a rating from 1 to 5.");

    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          boatId: reservation.boat._id,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to save review");
        return;
      }

      alert("Review saved!");
      setMyReview(data.review);
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteReview() {
    if (!myReview) return;
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/reviews/${myReview._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete review");
      alert("Review deleted");
      setMyReview(null);
      setRating(0);
      setComment("");
    } catch (err) {
      console.error(err);
      alert("Could not delete review");
    }
  }

  function handlePayment() {
    try {
      // Simulate payment success
      fetch(`http://localhost:5000/api/reservations/${reservation._id}/payment-success`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
    alert("Payment successful! Reservation is now approved.");
    setReservation((prev) => ({ ...prev, status: "paid" }));
  }

  if (loading) return <p>Loading reservation...</p>;
  if (!reservation) return <p className="text-danger">Reservation not found</p>;

  return (
    <div className="container mt-4">
      <button
        className="btn btn-link mb-3"
        onClick={() => navigate("/reservations/me")}
      >
        ← Back
      </button>
      <h2>Reservation Details</h2>

      <div className="card p-3 shadow-sm">
        <h4 onClick={() => navigate(`/boats/${reservation.boat?._id}`)}>
          {reservation.boat?.name}
        </h4>
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
              reservation.status === "paid"
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
          <div>
            <div className="mt-3 d-flex gap-2">
              <p>
                <strong>
                  Your reservation is confirmed, but it will not become approved
                  until payment is completed. If payment is not made within 3
                  days, the reservation will be automatically canceled.
                </strong>
              </p>
            </div>
            <div className="mt-3 d-flex gap-2">
              <button className="btn btn-warning" onClick={handleEdit}>
                Edit Reservation
              </button>
              <button className="btn btn-danger" onClick={handleCancel}>
                Cancel Reservation
              </button>
              <button className="btn btn-success" onClick={handlePayment}>Make Payment</button>
            </div>
          </div>
        )}
      </div>

      {/* Review form – tik jei completed */}
      {reservation.status === "completed" && (
        <div className="card p-3 shadow-sm mt-4">
          <h5>{myReview ? "Edit Your Review" : "Leave a Review"}</h5>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    color: star <= rating ? "#ffc107" : "#ddd",
                  }}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              className="form-control mb-2"
              rows={3}
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {myReview ? "Update Review" : "Submit Review"}
              </button>
              {myReview && (
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={handleDeleteReview}
                >
                  Delete Review
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
