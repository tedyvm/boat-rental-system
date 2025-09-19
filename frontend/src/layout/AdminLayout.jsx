import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <aside className="bg-dark text-white p-3" style={{ width: "250px" }}>
        <h4 className="mb-4">Admin Panel</h4>
        <nav className="nav flex-column">
          <NavLink to="/admin/boats" className="nav-link text-white">
            Boat List
          </NavLink>
          <NavLink to="/admin/boats/new" className="nav-link text-white">
            Add Boat
          </NavLink>
          <NavLink to="/admin/reservations" className="nav-link text-white">
            Reservation List
          </NavLink>
          <NavLink to="/admin/users" className="nav-link text-white">
            User Management
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-grow-1 p-4 bg-light">
        <Outlet />
      </main>
    </div>
  );
}
