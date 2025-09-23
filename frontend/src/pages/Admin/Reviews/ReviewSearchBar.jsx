export default function ReviewSearchBar({ filters, setFilters }) {
  return (
    <div className="row mb-3">
      <div className="col-md-6 mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search by boat name..."
          value={filters.boat}
          onChange={(e) => setFilters((f) => ({ ...f, boat: e.target.value }))}
        />
      </div>
      <div className="col-md-6 mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search by user name..."
          value={filters.user}
          onChange={(e) => setFilters((f) => ({ ...f, user: e.target.value }))}
        />
      </div>
    </div>
  );
}
