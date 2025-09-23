export default function BoatSearchBar({ filters, onChange }) {
  return (
    <div className="row mb-3">
      <div className="col-md-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name..."
          value={filters.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>
      <div className="col-md-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by location..."
          value={filters.location}
          onChange={(e) => onChange({ location: e.target.value })}
        />
      </div>
      <div className="col-md-3">
        <select
          className="form-select"
          value={filters.type}
          onChange={(e) => onChange({ type: e.target.value })}
        >
          <option value="">All types</option>
          <option value="Catamaran">Catamaran</option>
          <option value="Sailing Yacht">Sailing Yacht</option>
          <option value="Speed Boat">Speed Boat</option>
          <option value="Small Boat">Small Boat</option>
        </select>
      </div>
      <div className="col-md-3">
        <select
          className="form-select"
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value })}
        >
          <option value="">All status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
    </div>
  );
}
