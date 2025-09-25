export default function ReservationTable({
  reservations,
  loading,
  sortField,
  sortDirection,
  onSortChange,
  today,
  onRowClick,
}) {
  if (loading) return <p>Loading reservations...</p>;
  if (reservations.length === 0)
    return (
      <p className="text-center text-muted mt-3">No reservations found.</p>
    );

  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th
            onClick={() => onSortChange("boat")}
            style={{ cursor: "pointer" }}
          >
            Boat {sortField === "boat" && (sortDirection === "asc" ? "↑" : "↓")}
          </th>
          <th
            onClick={() => onSortChange("user")}
            style={{ cursor: "pointer" }}
          >
            User {sortField === "user" && (sortDirection === "asc" ? "↑" : "↓")}
          </th>
          <th
            onClick={() => onSortChange("startDate")}
            style={{ cursor: "pointer" }}
          >
            Start Date{" "}
            {sortField === "startDate" && (sortDirection === "asc" ? "↑" : "↓")}
          </th>
          <th
            onClick={() => onSortChange("endDate")}
            style={{ cursor: "pointer" }}
          >
            End Date{" "}
            {sortField === "endDate" && (sortDirection === "asc" ? "↑" : "↓")}
          </th>
          <th
            onClick={() => onSortChange("createdAt")}
            style={{ cursor: "pointer" }}
          >
            Created At{" "}
            {sortField === "createdAt" && (sortDirection === "asc" ? "↑" : "↓")}
          </th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {reservations.map((o) => (
          <tr
            key={o._id}
            style={{ cursor: "pointer" }}
            onClick={() => onRowClick(o._id)}
          >
            <td>{o.boat?.name || "Deleted boat"}</td>
            <td>{o.user?.username || "Deleted user"}</td>
            <td>{new Date(o.startDate).toLocaleDateString()}</td>
            <td>{new Date(o.endDate).toLocaleDateString()}</td>
            <td>{new Date(o.createdAt).toLocaleDateString()}</td>
            <td>
              <span
                className={`badge ${
                  o.status === "paid"
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
                    const diffMs = today - created;
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}
