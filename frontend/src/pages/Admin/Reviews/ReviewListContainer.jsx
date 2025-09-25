import { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../../../context/AuthContext";
import ReviewSearchBar from "./ReviewSearchBar";
import ReviewTable from "./ReviewTable";

export default function ReviewListContainer() {
  const { token } = useContext(AuthContext);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- filtrai ---
  const [filters, setFilters] = useState({
    boat: "",
    user: "",
  });

  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage, setReviewsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: currentPage,
        limit: reviewsPerPage,
        sortField,
        sortDirection,
      });
      if (filters.boat.trim()) params.append("boat", filters.boat);
      if (filters.user.trim()) params.append("user", filters.user);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/reviews?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();

      setReviews(data.reviews);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, reviewsPerPage, sortField, sortDirection, token]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete review");
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert("Failed to delete review");
    }
  };

  return (
    <div className="container">
      <h2 className="my-3">Admin Reviews</h2>

      <ReviewSearchBar filters={filters} setFilters={setFilters} />

      <ReviewTable
        reviews={reviews}
        loading={loading}
        onDelete={handleDelete}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={(field) => {
          if (sortField === field) {
            setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
          } else {
            setSortField(field);
            setSortDirection("asc");
          }
          setCurrentPage(1);
        }}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center my-3">
          <button
            className="btn btn-secondary me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>

          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn btn-secondary ms-2"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>

          <select
            className="form-select ms-3"
            style={{ width: "auto" }}
            value={reviewsPerPage}
            onChange={(e) => {
              setReviewsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      )}

      {reviews.length === 0 && !loading && (
        <p className="text-center text-muted mt-3">
          No reviews match current filters.
        </p>
      )}
    </div>
  );
}
