import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminOrdersList() {
  const today = new Date();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [boatSearch, setBoatSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const [sortField, setSortField] = useState("startDate");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:5000/api/admin/reservations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch reservations");
        const data = await res.json();
        setOrders(data);
        setFilteredOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  useEffect(() => {
    handleFilterAndSort();
  }, [
    selectedStatuses,
    boatSearch,
    userSearch,
    sortField,
    sortDirection,
    orders,
  ]);

  const handleFilterAndSort = () => {
    let filtered = [...orders];

    // Filtras pagal statusą
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((o) => selectedStatuses.includes(o.status));
    }

    // Filtras pagal boat name
    if (boatSearch.trim() !== "") {
      filtered = filtered.filter((o) =>
        o.boat?.name?.toLowerCase().includes(boatSearch.toLowerCase())
      );
    }

    // Filtras pagal user name
    if (userSearch.trim() !== "") {
      filtered = filtered.filter((o) =>
        o.user?.username?.toLowerCase().includes(userSearch.toLowerCase())
      );
    }

    // Rūšiavimas
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

    setFilteredOrders(filtered);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  if (loading) return <p>Loading reservations...</p>;

  return (
    <div className="container">
      <h2 className="my-3">Admin Orders</h2>

      {/* Filters row */}
      <div className="row d-flex flex-wrap gap-2 mb-3">
        <div className="d-flex flex-wrap gap-2">
          {[
            "pending",
            "approved",
            "rejected",
            "active",
            "completed",
            "cancelled",
          ].map((status) => (
            <div key={status} className="form-check form-check-inline">
              <input
                type="checkbox"
                className="form-check-input"
                id={`status-${status}`}
                checked={selectedStatuses.includes(status)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedStatuses((prev) => [...prev, status]);
                  } else {
                    setSelectedStatuses((prev) =>
                      prev.filter((s) => s !== status)
                    );
                  }
                }}
              />
              <label className="form-check-label" htmlFor={`status-${status}`}>
                {status}
              </label>
            </div>
          ))}
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() =>
                setSelectedStatuses([
                  "pending",
                  "approved",
                  "rejected",
                  "active",
                  "completed",
                  "cancelled",
                ])
              }
            >
              Select All
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setSelectedStatuses([])}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Boat name search */}
        <input
          type="text"
          className="form-control w-auto"
          placeholder="Search boat name..."
          value={boatSearch}
          onChange={(e) => setBoatSearch(e.target.value)}
        />

        {/* User name search */}
        <input
          type="text"
          className="form-control w-auto"
          placeholder="Search user..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th
              onClick={() => handleSort("boat")}
              style={{ cursor: "pointer" }}
            >
              Boat{" "}
              {sortField === "boat" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              onClick={() => handleSort("user")}
              style={{ cursor: "pointer" }}
            >
              User{" "}
              {sortField === "user" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              onClick={() => handleSort("startDate")}
              style={{ cursor: "pointer" }}
            >
              Start Date{" "}
              {sortField === "startDate" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              onClick={() => handleSort("endDate")}
              style={{ cursor: "pointer" }}
            >
              End Date{" "}
              {sortField === "endDate" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              onClick={() => handleSort("createdAt")}
              style={{ cursor: "pointer" }}
            >
              Created At{" "}
              {sortField === "createdAt" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.map((o) => (
            <tr
              key={o._id}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/admin/reservations/${o._id}`)}
            >
              <td>{o.boat?.name || "Deleted boat"}</td>
              <td>{o.user?.username || "Deleted user"}</td>
              <td>{new Date(o.startDate).toLocaleDateString()}</td>
              <td>{new Date(o.endDate).toLocaleDateString()}</td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td>
                <span
                  className={`badge ${
                    o.status === "approved"
                      ? "bg-success"
                      : o.status === "pending"
                      ? "bg-warning text-dark"
                      : "bg-secondary"
                  }`}
                >
                  {o.status}
                  {o.status === "pending" &&
                    (() => {
                      const created = new Date(o.createdAt);
                      const diffMs = today - created; // ms nuo sukurimo
                      const daysPassed = Math.floor(
                        diffMs / (1000 * 60 * 60 * 24)
                      );
                      const daysLeft = 3 - daysPassed;

                      return (
                        <div style={{ fontSize: "0.8em" }}>
                          left {daysLeft > 0 ? daysLeft : 0}d
                        </div>
                      );
                    })()}
                </span>
              </td>

              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/admin/reservations/${o._id}`);
                  }}
                >
                  Edit
                </button>

                {(o.status === "completed" ||
                  o.status === "rejected" ||
                  o.status === "cancelled") && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (
                        !window.confirm(
                          "Are you sure you want to delete this reservation?"
                        )
                      )
                        return;

                      try {
                        const res = await fetch(
                          `http://localhost:5000/api/admin/reservations/${o._id}`,
                          {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${token}` },
                          }
                        );

                        if (!res.ok)
                          throw new Error("Failed to delete reservation");
                        setOrders((prev) =>
                          prev.filter((r) => r._id !== o._id)
                        );
                      } catch (err) {
                        console.error("Failed to delete reservation", err);
                        alert("Could not delete reservation");
                      }
                    }}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredOrders.length === 0 && (
        <p className="text-center text-muted mt-3">
          No reservations found with current filters.
        </p>
      )}
    </div>
  );
}
