import { useState } from "react";

export default function AdminBoatFilters({ onFilter }) {
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");

  const handleChange = (newSearch) => {
    onFilter({
      status,
      type,
      search: newSearch !== undefined ? newSearch : search,
    });
  };

  return (
    <div className="mb-3 d-flex flex-wrap align-items-end gap-3">
      {/* Status filter */}
      <div>
        <label htmlFor="statusFilter" className="form-label fw-bold">
          Status
        </label>
        <select
          id="statusFilter"
          className="form-select"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            handleChange();
          }}
        >
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Type filter */}
      <div>
        <label htmlFor="typeFilter" className="form-label fw-bold">
          Type
        </label>
        <select
          id="typeFilter"
          className="form-select"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            handleChange();
          }}
        >
          <option value="all">All</option>
          <option value="yacht">Yacht</option>
          <option value="motor">Motor Boat</option>
          <option value="sailboat">Sailboat</option>
        </select>
      </div>

      {/* Search */}
      <div className="flex-grow-1">
        <label htmlFor="searchInput" className="form-label fw-bold">
          Search
        </label>
        <input
          type="text"
          id="searchInput"
          className="form-control"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleChange(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
