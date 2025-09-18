import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminBoatFilters from "../../components/admin/AdminBoatFilters";

export default function AdminBoatList() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sort, setSort] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBoats();
  }, [token, currentPage, searchTerm, selectedType, selectedStatus, sort]);

  async function fetchBoats() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", currentPage);
      params.set("limit", 10);
      if (searchTerm) params.set("search", searchTerm);
      if (selectedType) params.set("type", selectedType);
      if (selectedStatus) params.set("status", selectedStatus);
      if (sort) params.set("sort", sort);

      const res = await fetch(
        `http://localhost:5000/api/admin/boats?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setBoats(data.boats);
      setTotalPages(data.pages);
    } catch (err) {
      console.error("Failed to fetch boats", err);
    } finally {
      setLoading(false);
    }
  }

  const handleFilter = ({ status, type, search }) => {
    setCurrentPage(1); // kai keiti filtrus, grįžti į 1 puslapį
    setSelectedStatus(status !== "all" ? status : "");
    setSelectedType(type !== "all" ? type : "");
    setSearchTerm(search);
  };

  const handleSort = (field) => {
    let newSort = "";
    if (sort === `${field}-asc`) newSort = `${field}-desc`;
    else newSort = `${field}-asc`;
    setSort(newSort);
  };

  if (loading) return <p>Loading boats...</p>;

  return (
    <div className="container">
      <h2 className="my-3">Admin Boat List</h2>
      <AdminBoatFilters onFilter={handleFilter} />

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("pricePerDay")}
            >
              Price/Day{" "}
              {sort.startsWith("pricePerDay") &&
                (sort.endsWith("asc") ? "↑" : "↓")}
            </th>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("capacity")}
            >
              Capacity{" "}
              {sort.startsWith("capacity") &&
                (sort.endsWith("asc") ? "↑" : "↓")}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {boats.map((boat) => (
            <tr key={boat._id}>
              <td>{boat.name}</td>
              <td>{boat.type}</td>
              <td>
                <span
                  className={`badge ${
                    boat.status === "published" ? "bg-success" : "bg-secondary"
                  }`}
                  style={{ cursor: "pointer" }}
                  title="Click to toggle status"
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
}
