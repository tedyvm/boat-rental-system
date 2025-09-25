import { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import BoatSearchBar from "./BoatSearchBar";
import BoatTable from "./BoatTable";

export default function BoatListContainer() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    name: "",
    location: "",
    type: "",
    status: "",
  });

  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [boatsPerPage, setBoatsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBoats = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: boatsPerPage,
        sortField,
        sortDirection,
      });

      if (filters.name) params.append("name", filters.name);
      if (filters.location) params.append("location", filters.location);
      if (filters.type) params.append("type", filters.type);
      if (filters.status) params.append("status", filters.status);

      console.log("🔎 Fetching boats:", params.toString());

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/boats?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch boats");
      const data = await res.json();

      setBoats(data.boats);
      setTotalPages(data.pages);
    } catch (err) {
      console.error("❌ Failed to fetch boats", err);
      setBoats([]);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, boatsPerPage, sortField, sortDirection, token]);

  useEffect(() => {
    fetchBoats();
  }, [fetchBoats]);

  const handleSort = (field) => {
    setSortField((prev) => (prev === field ? prev : field));
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    setCurrentPage(1);
  };

  const toggleStatus = async (boat) => {
    const newStatus = boat.status === "published" ? "draft" : "published";
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/admin/boats/${boat._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      setBoats((prev) =>
        prev.map((b) => (b._id === boat._id ? { ...b, status: newStatus } : b))
      );
    } catch (error) {
      console.error("Failed to toggle status", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this boat?")) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/admin/boats/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoats((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Failed to delete boat", error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-3">Admin Boat List</h2>

      <BoatSearchBar
        filters={filters}
        onChange={(newFilters) => {
          setFilters((prev) => ({ ...prev, ...newFilters }));
          setCurrentPage(1);
        }}
      />

      <BoatTable
        boats={boats}
        loading={loading}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSort}
        onToggleStatus={toggleStatus}
        onDelete={handleDelete}
        onEdit={(id) => navigate(`/admin/boats/${id}`)}
      />

      <button
        className="btn btn-success mb-3"
        onClick={() => navigate("/admin/boats/new")}
      >
        + Add New Boat
      </button>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center my-3">
          <button
            className="btn btn-secondary me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            Previous
          </button>

          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn btn-secondary ms-2"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            Next
          </button>

          <select
            className="form-select ms-3"
            style={{ width: "auto" }}
            value={boatsPerPage}
            onChange={(e) => {
              setBoatsPerPage(parseInt(e.target.value));
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
    </div>
  );
}
