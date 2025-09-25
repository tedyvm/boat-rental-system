import { useEffect, useState, useCallback } from "react";
import UserSearchBar from "./UserSearchBar";
import UserTable from "./UserTable";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export default function UserListContainer() {
  const { token } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // filtrai
  const [filters, setFilters] = useState({
    name: "",
    familyName: "",
    username: "",
    role: "all",
  });

  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: usersPerPage,
        sortField,
        sortDirection,
      });
      if (filters.name.trim()) params.append("name", filters.name);
      if (filters.familyName.trim())
        params.append("familyName", filters.familyName);
      if (filters.username.trim()) params.append("username", filters.username);
      if (filters.role !== "all") params.append("role", filters.role);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();

      setUsers(data.users);
      setTotalPages(data.pages);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, usersPerPage, sortField, sortDirection, token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="container">
      <h2 className="my-3">Admin Users</h2>

      <UserSearchBar filters={filters} setFilters={setFilters} />

      <UserTable
        users={users}
        loading={loading}
        onDelete={handleDelete}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={(field) => {
          if (sortField === field) {
            setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
          } else {
            setSortField(field);
            setSortDirection("asc");
          }
        }}
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
            value={usersPerPage}
            onChange={(e) => {
              setUsersPerPage(parseInt(e.target.value));
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
