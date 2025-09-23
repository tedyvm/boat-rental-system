export default function BoatTable({
  boats,
  loading,
  sortField,
  sortDirection,
  onSortChange,
  onToggleStatus,
  onDelete,
  onEdit,
}) {
  if (loading) return <p>Loading boats...</p>;
  if (boats.length === 0)
    return <p className="text-center text-muted">No boats found.</p>;

  const sortableHeader = (field, label) => (
    <th style={{ cursor: "pointer" }} onClick={() => onSortChange(field)}>
      {label} {sortField === field && (sortDirection === "asc" ? "↑" : "↓")}
    </th>
  );

  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          {sortableHeader("name", "Name")}
          {sortableHeader("location", "Location")}
          {sortableHeader("type", "Type")}
          {sortableHeader("year", "Year")}
          {sortableHeader("length", "Length")}
          {sortableHeader("cabins", "Cabins")}
          {sortableHeader("rating", "Rating")}
          {sortableHeader("numberOfReviews", "Reviews")}
          <th>Status</th>
          {sortableHeader("pricePerDay", "Price/Day")}
          {sortableHeader("capacity", "Capacity")}
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
            <td>{boat.rating}</td>
            <td>{boat.numberOfReviews}</td>
            <td>
              <span
                className={`badge ${
                  boat.status === "published" ? "bg-success" : "bg-secondary"
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => onToggleStatus(boat)}
              >
                {boat.status}
              </span>
            </td>
            <td>{boat.pricePerDay} €</td>
            <td>{boat.capacity}</td>
            <td>
              <button
                className="btn btn-sm btn-primary me-2"
                onClick={() => onEdit(boat._id)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => onDelete(boat._id)}
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
