import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function AdminReviewList() {
  const { token } = useContext(AuthContext);

  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [boatSearch, setBoatSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/admin/reviews", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);
        setFilteredReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [token]);

  useEffect(() => {
    handleFilterAndSort();
  }, [boatSearch, userSearch, sortField, sortDirection, reviews]);

  const handleFilterAndSort = () => {
    let filtered = [...reviews];

    if (boatSearch.trim()) {
      filtered = filtered.filter((r) =>
        r.boat?.name?.toLowerCase().includes(boatSearch.toLowerCase())
      );
    }

    if (userSearch.trim()) {
      filtered = filtered.filter((r) =>
        r.user?.username?.toLowerCase().includes(userSearch.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let valA, valB;
      if (sortField === "boat") {
        valA = a.boat?.name || "";
        valB = b.boat?.name || "";
      } else if (sortField === "user") {
        valA = a.user?.username || "";
        valB = b.user?.username || "";
      } else {
        valA = new Date(a[sortField]);
        valB = new Date(b[sortField]);
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredReviews(filtered);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete review");
      setReviews((prev) => prev.filter((r) => r._id !== id));
      setFilteredReviews((prev) => prev.filter((r) => r._id !== id));
      alert("Review deleted successfully");
    } catch (err) {
      console.error("Failed to delete review:", err);
      alert("Error deleting review");
    }
  }

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div className="container">
      <h2 className="my-3">Admin Reviews</h2>

      {/* Search filters */}
      <div className="row mb-3">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by boat name..."
            value={boatSearch}
            onChange={(e) => setBoatSearch(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by user name..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("boat")}
            >
              Boat{" "}
              {sortField === "boat" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("user")}
            >
              User{" "}
              {sortField === "user" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th>Rating</th>
            <th>Comment</th>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("createdAt")}
            >
              Date{" "}
              {sortField === "createdAt" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredReviews.map((r) => (
            <tr key={r._id}>
              <td>{r.boat?.name || "Deleted boat"}</td>
              <td>{r.user?.username || "Deleted user"}</td>
              <td>{"⭐".repeat(r.rating)}</td>
              <td>{r.comment}</td>
              <td>{new Date(r.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(r._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredReviews.length === 0 && (
        <p className="text-center text-muted mt-3">
          No reviews match current filters.
        </p>
      )}
    </div>
  );
}
