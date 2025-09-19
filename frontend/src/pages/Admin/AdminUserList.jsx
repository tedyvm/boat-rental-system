import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminUserList() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userSearch, setUserSearch] = useState("");
  const [sortField, setSortField] = useState("username");
  const [sortDirection, setSortDirection] = useState("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        
        const usersArray = Array.isArray(data) ? data : data.users;

        setUsers(usersArray);
        setFilteredUsers(usersArray);
      } catch (err) {
        console.error(err);
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    handleFilterAndSort();
    setCurrentPage(1); // resetinam puslapį kai keičiasi filtrai
  }, [userSearch, sortField, sortDirection, users]);

  const handleFilterAndSort = () => {
    let filtered = [...users];

    // Filtras pagal username
    if (userSearch.trim() !== "") {
      filtered = filtered.filter((u) =>
        u.username.toLowerCase().includes(userSearch.toLowerCase())
      );
    }

    // Rūšiavimas
    filtered.sort((a, b) => {
      const valA = a[sortField].toLowerCase();
      const valB = b[sortField].toLowerCase();
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredUsers(filtered);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  if (loading) return <p>Loading users...</p>;

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container">
      <h2 className="my-3">Admin Users</h2>

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control w-auto"
          placeholder="Search username..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th
              onClick={() => handleSort("username")}
              style={{ cursor: "pointer" }}
            >
              Username{" "}
              {sortField === "username" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              onClick={() => handleSort("email")}
              style={{ cursor: "pointer" }}
            >
              Email{" "}
              {sortField === "email" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedUsers.map((u) => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                <span
                  className={`badge ${
                    u.role === "admin" ? "bg-danger" : "bg-secondary"
                  }`}
                >
                  {u.role}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => navigate(`/admin/users/${u._id}`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(u._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredUsers.length === 0 && (
        <p className="text-center text-muted mt-3">No users found.</p>
      )}

      {/* Pagination */}
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
