export default function ReservationSearchBar({ filters, setFilters }) {
  const statuses = ["pending", "approved", "rejected", "active", "completed", "cancelled"];

  const toggleStatus = (status) => {
    setFilters((f) => ({
      ...f,
      statuses: f.statuses.includes(status)
        ? f.statuses.filter((s) => s !== status)
        : [...f.statuses, status],
    }));
  };

  return (
    <div className="row d-flex flex-wrap gap-2 mb-3">
      <div className="d-flex flex-wrap gap-2">
        {statuses.map((status) => (
          <div key={status} className="form-check form-check-inline">
            <input
              type="checkbox"
              className="form-check-input"
              id={`status-${status}`}
              checked={filters.statuses.includes(status)}
              onChange={() => toggleStatus(status)}
            />
            <label className="form-check-label" htmlFor={`status-${status}`}>
              {status}
            </label>
          </div>
        ))}
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() =>
              setFilters((f) => ({ ...f, statuses: [...statuses] }))
            }
          >
            Select All
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setFilters((f) => ({ ...f, statuses: [] }))}
          >
            Clear
          </button>
        </div>
      </div>

      <input
        type="text"
        className="form-control w-auto"
        placeholder="Search boat name..."
        value={filters.boat}
        onChange={(e) => setFilters((f) => ({ ...f, boat: e.target.value }))}
      />

      <input
        type="text"
        className="form-control w-auto"
        placeholder="Search user..."
        value={filters.user}
        onChange={(e) => setFilters((f) => ({ ...f, user: e.target.value }))}
      />
    </div>
  );
}
