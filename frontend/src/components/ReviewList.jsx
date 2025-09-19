import { useEffect, useState } from "react";
import StarRating from "./StarRating";

export default function ReviewList({ boatId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/reviews/boat/${boatId}`
        );
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Failed to load reviews", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [boatId]);

  if (loading) return <p>Loading reviews...</p>;

  if (reviews.length === 0) {
    return <p className="text-muted">No reviews yet.</p>;
  }

  return (
    <div className="list-group">
      {reviews.map((r) => (
        <div key={r._id} className="list-group-item">
          <div className="d-flex justify-content-between">
            <strong>{r.user?.username || "Anonymous"}</strong>
            <StarRating rating={r.rating} size={16} />
          </div>
          {r.comment && <p className="mb-1">{r.comment}</p>}
          <small className="text-muted">
            {new Date(r.createdAt).toLocaleDateString()}
          </small>
        </div>
      ))}
    </div>
  );
}
