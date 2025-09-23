import { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ReservationSearchBar from "./ReservationSearchBar";
import ReservationTable from "./ReservationTable";

export default function ReservationListContainer() {
  const today = new Date();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    boat: "",
    user: "",
    statuses: [],
  });

  const [sortField, setSortField] = useState("startDate");
  const [sortDirection, setSortDirection] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [reservationsPerPage, setReservationsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: currentPage,
        limit: reservationsPerPage,
        sortField,
        sortDirection,
      });

      if (filters.boat.trim()) params.append("boat", filters.boat);
      if (filters.user.trim()) params.append("user", filters.user);
      if (filters.statuses.length > 0)
        params.append("statuses", filters.statuses.join(","));

      const res = await fetch(
        `http://localhost:5000/api/admin/reservations?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch reservations");
      const data = await res.json();

      setReservations(data.reservations);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, reservationsPerPage, sortField, sortDirection, token]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  return (
    <div className="container">
      <h2 className="my-3">Admin Reservations</h2>

      <ReservationSearchBar filters={filters} setFilters={setFilters} />

      <ReservationTable
        reservations={reservations}
        loading={loading}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSort}
        today={today}
        onRowClick={(id) => navigate(`/admin/reservations/${id}`)}
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
            value={reservationsPerPage}
            onChange={(e) => {
              setReservationsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      )}
    </div>
  );
}
