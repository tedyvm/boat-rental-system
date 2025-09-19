import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminOrdersList() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [boatSearch, setBoatSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const [sortField, setSortField] = useState("startDate");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/admin/reservations", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
  }, [selectedStatus, boatSearch, userSearch, sortField, sortDirection, orders]);

  const handleFilterAndSort = () => {
    let filtered = [...orders];

    // Filtras pagal statusą
    if (selectedStatus !== "all") {
      filtered = filtered.filter((o) => o.status === selectedStatus);
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
      <div className="d-flex flex-wrap gap-2 mb-3">
        {/* Status filter */}
        <select
          className="form-select w-auto"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

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
            <th onClick={() => handleSort("boat")} style={{ cursor: "pointer" }}>
              Boat {sortField === "boat" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("user")} style={{ cursor: "pointer" }}>
              User {sortField === "user" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("startDate")} style={{ cursor: "pointer" }}>
              Start Date {sortField === "startDate" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("endDate")} style={{ cursor: "pointer" }}>
              End Date {sortField === "endDate" && (sortDirection === "asc" ? "↑" : "↓")}
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
                </span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/admin/reservations/${o._id}`);
                  }}
                >
                  Edit
                </button>
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
