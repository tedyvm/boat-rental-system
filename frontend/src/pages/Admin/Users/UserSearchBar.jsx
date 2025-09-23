export default function UserSearchBar({ filters, setFilters }) {
  return (
    <div className="d-flex flex-wrap gap-2 mb-3">
      <input
        type="text"
        className="form-control w-auto"
        placeholder="Search name..."
        value={filters.name}
        onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
      />
      <input
        type="text"
        className="form-control w-auto"
        placeholder="Search family name..."
        value={filters.familyName}
        onChange={(e) =>
          setFilters((f) => ({ ...f, familyName: e.target.value }))
        }
      />
      <input
        type="text"
        className="form-control w-auto"
        placeholder="Search username..."
        value={filters.username}
        onChange={(e) =>
          setFilters((f) => ({ ...f, username: e.target.value }))
        }
      />

      <select
        className="form-select w-auto"
        value={filters.role}
        onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}
      >
        <option value="all">All roles</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  );
}
