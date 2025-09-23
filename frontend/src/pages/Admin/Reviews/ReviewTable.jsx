export default function ReviewTable({
  reviews,
  loading,
  onDelete,
  sortField,
  sortDirection,
  onSortChange,
}) {
  if (loading) return <p>Loading reviews...</p>;

  if (reviews.length === 0) {
    return <p className="text-center text-muted">No reviews found.</p>;
  }

  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th
            style={{ cursor: "pointer" }}
            onClick={() => onSortChange("boat")}
          >
            Boat {sortField === "boat" && (sortDirection === "asc" ? "↑" : "↓")}
          </th>
          <th
            style={{ cursor: "pointer" }}
            onClick={() => onSortChange("user")}
          >
            User {sortField === "user" && (sortDirection === "asc" ? "↑" : "↓")}
          </th>
          <th>Rating</th>
          <th>Comment</th>
          <th
            style={{ cursor: "pointer" }}
            onClick={() => onSortChange("createdAt")}
          >
            Date{" "}
            {sortField === "createdAt" && (sortDirection === "asc" ? "↑" : "↓")}
          </th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {reviews.map((r) => (
          <tr key={r._id}>
            <td>{r.boat?.name || "Deleted boat"}</td>
            <td>{r.user?.username || "Deleted user"}</td>
            <td>{"⭐".repeat(r.rating)}</td>
            <td>{r.comment}</td>
            <td>{new Date(r.createdAt).toLocaleDateString()}</td>
            <td>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => onDelete(r._id)}
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
