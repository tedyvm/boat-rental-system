import { useNavigate } from "react-router-dom";

export default function UserTable({
  users,
  loading,
  onDelete,
  sortField,
  sortDirection,
  onSortChange,
}) {
  const navigate = useNavigate();

  if (loading) return <p>Loading users...</p>;
  if (users.length === 0)
    return <p className="text-center text-muted mt-3">No users found.</p>;

  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th style={{ cursor: "pointer" }} onClick={() => onSortChange("name")}>
            Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
          </th>
          <th
            style={{ cursor: "pointer" }}
            onClick={() => onSortChange("familyName")}
          >
            Family Name{" "}
            {sortField === "familyName" &&
              (sortDirection === "asc" ? "↑" : "↓")}
          </th>
          <th style={{ cursor: "pointer" }} onClick={() => onSortChange("country")}>
            Country {sortField === "country" && (sortDirection === "asc" ? "↑" : "↓")}
          </th>
          <th>Phone</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {users.map((u) => (
          <tr key={u._id}>
            <td>{u.name}</td>
            <td>{u.familyName}</td>
            <td>{u.country}</td>
            <td>{u.phone}</td>
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
                onClick={() => onDelete(u._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
