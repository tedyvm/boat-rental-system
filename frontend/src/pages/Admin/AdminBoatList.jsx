import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function AdminBoatList() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);

  // filtrai
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // sort
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBoats();
  }, [
    token,
    currentPage,
    searchName,
    searchLocation,
    selectedType,
    selectedStatus,
    sortField,
    sortDirection,
  ]);

  async function fetchBoats() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", currentPage);
      params.set("limit", 10);
      if (searchName) params.set("name", searchName);
      if (searchLocation) params.set("location", searchLocation);
      if (selectedType) params.set("type", selectedType);
      if (selectedStatus) params.set("status", selectedStatus);
      params.set("sort", `${sortField}-${sortDirection}`);

      const res = await fetch(
        `http://localhost:5000/api/admin/boats?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch boats");
      const data = await res.json();
      setBoats(data.boats);
      setTotalPages(data.pages);
    } catch (err) {
      console.error("Failed to fetch boats", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  async function toggleStatus(boat) {
    const newStatus = boat.status === "published" ? "draft" : "published";
    try {
      await fetch(`http://localhost:5000/api/admin/boats/${boat._id}`, {
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
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this boat?")) return;
    try {
      await fetch(`http://localhost:5000/api/admin/boats/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoats((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Failed to delete boat", error);
    }
  }

  if (loading) return <p>Loading boats...</p>;

  return (
    <div className="container">
      <h2 className="my-3">Admin Boat List</h2>

      {/* Filtrai */}
      <div className="row mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All types</option>
            <option value="Catamaran">Catamaran</option>
            <option value="Sailing Yacht">Sailing Yacht</option>
            <option value="Speed Boat">Speed Boat</option>
            <option value="Small Boat">Small Boat</option>
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Lentelė */}
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("name")}
            >
              Name{" "}
              {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("location")}
            >
              Location{" "}
              {sortField === "location" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("type")}
            >
              Type{" "}
              {sortField === "type" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("year")}
            >
              Year{" "}
              {sortField === "year" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("length")}
            >
              Length{" "}
              {sortField === "length" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("cabins")}
            >
              Cabins{" "}
              {sortField === "cabins" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th>Status</th>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("pricePerDay")}
            >
              Price/Day{" "}
              {sortField === "pricePerDay" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("capacity")}
            >
              Capacity{" "}
              {sortField === "capacity" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {boats.map((boat) => (
            <tr key={boat._id}>
              <td>{boat.name}</td>
              <td>{boat.location}</td>
              <td>{boat.type}</td>
              <td>{boat.year}</td>
              <td>{boat.length} m</td>
              <td>{boat.cabins}</td>
              <td>
                <span
                  className={`badge ${
                    boat.status === "published" ? "bg-success" : "bg-secondary"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleStatus(boat)}
                >
                  {boat.status}
                </span>
              </td>
              <td>{boat.pricePerDay} €</td>
              <td>{boat.capacity}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => navigate(`/admin/boats/${boat._id}`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(boat._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="btn btn-success mb-3"
        onClick={() => navigate("/admin/boats/new")}
      >
        + Add New Boat
      </button>

      {totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                &laquo;
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
