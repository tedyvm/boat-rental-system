import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function LoginModal({ onClose, onSuccess }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Įsitikinkim, kad AuthContext gauna user objektą
      login({
        token: data.token,
        user: {
          _id: data._id,
          name: data.name,
          familyName: data.familyName,
          username: data.username,
          email: data.email,
          phone: data.phone,
          country: data.country,
          role: data.role,
        },
      });

      onSuccess?.(); // uždaro modalą po login
      console.log(data.role);
      if (data.role === "admin") {
        window.location.href = "/admin/boats"; // Nukreipia į admin dashboard
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 1050,
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Log In</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
              <p className="mt-3">
                Don't have an account? <a href="/register">Sign up</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
