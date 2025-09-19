import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminUserList() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nameSearch, setNameSearch] = useState("");
  const [familyNameSearch, setFamilyNameSearch] = useState("");
  const [usernameSearch, setUsernameSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [sortField, setSortField] = useState("name");
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
    setCurrentPage(1);
  }, [nameSearch, familyNameSearch, usernameSearch, roleFilter, sortField, sortDirection, users]);

  const handleFilterAndSort = () => {
    let filtered = [...users];

    // Paieška pagal vardą
    if (nameSearch.trim() !== "") {
      filtered = filtered.filter((u) =>
        u.name?.toLowerCase().includes(nameSearch.toLowerCase())
      );
    }

    // Paieška pagal pavardę
    if (familyNameSearch.trim() !== "") {
      filtered = filtered.filter((u) =>
        u.familyName?.toLowerCase().includes(familyNameSearch.toLowerCase())
      );
    }

    // Paieška pagal username
    if (usernameSearch.trim() !== "") {
      filtered = filtered.filter((u) =>
        u.username?.toLowerCase().includes(usernameSearch.toLowerCase())
      );
    }

    // Filtras pagal rolę
    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    // Rūšiavimas pagal pasirinkta lauką
    filtered.sort((a, b) => {
      const valA = (a[sortField] || "").toString().toLowerCase();
      const valB = (b[sortField] || "").toString().toLowerCase();
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

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container">
      <h2 className="my-3">Admin Users</h2>

      {/* Search filters */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <input
          type="text"
          className="form-control w-auto"
          placeholder="Search name..."
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
        />
        <input
          type="text"
          className="form-control w-auto"
          placeholder="Search family name..."
          value={familyNameSearch}
          onChange={(e) => setFamilyNameSearch(e.target.value)}
        />
        <input
          type="text"
          className="form-control w-auto"
          placeholder="Search username..."
          value={usernameSearch}
          onChange={(e) => setUsernameSearch(e.target.value)}
        />

        <select
          className="form-select w-auto"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
              Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("familyName")} style={{ cursor: "pointer" }}>
              Family Name{" "}
              {sortField === "familyName" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("country")} style={{ cursor: "pointer" }}>
              Country{" "}
              {sortField === "country" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th>Phone</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedUsers.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.familyName}</td>
              <td>{u.country}</td>
              <td>{u.phone}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                <span
                  className={`badge ${u.role === "admin" ? "bg-danger" : "bg-secondary"}`}
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
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
