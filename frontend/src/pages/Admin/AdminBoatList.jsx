import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AdminBoatFilters from "../../components/admin/AdminBoatFilters";

export default function AdminBoatList() {
  const { token } = useContext(AuthContext);
  const [boats, setBoats] = useState([]);
  const [filteredBoats, setFilteredBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const fetchBoats = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/admin/boats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch boats");
        const data = await res.json();
        setBoats(data);
        setFilteredBoats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoats();
  }, [token]);

  const handleFilter = ({ status, type, search }) => {
    let filtered = [...boats];

    if (status !== "all") {
      filtered = filtered.filter((b) => b.status === status);
    }

    if (type !== "all") {
      filtered = filtered.filter((b) => b.type === type);
    }

    if (search.trim() !== "") {
      filtered = filtered.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredBoats(filtered);
  };

  const handleSort = (field) => {
    let direction = sortDirection;
    if (sortField === field) {
      direction = sortDirection === "asc" ? "desc" : "asc";
    } else {
      direction = "asc";
    }
    setSortField(field);
    setSortDirection(direction);

    setFilteredBoats((prev) =>
      [...prev].sort((a, b) => {
        const valueA = a[field];
        const valueB = b[field];
        if (valueA < valueB) return direction === "asc" ? -1 : 1;
        if (valueA > valueB) return direction === "asc" ? 1 : -1;
        return 0;
      })
    );
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
          {filteredBoats.map((boat) => (
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
                  onClick={() =>
                    (window.location.href = `/admin/boats/${boat._id}`)
                  }
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
      setFilteredBoats((prev) =>
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
      setFilteredBoats((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Failed to delete boat", error);
    }
  }
}
