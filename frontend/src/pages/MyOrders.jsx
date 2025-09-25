import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/MyOrders.css";

export default function MyOrders() {
  const { token } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load reservations");
        const data = await res.json();
        setReservations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [token]);

  if (loading) return <p>Loading your reservations...</p>;

  if (reservations.length === 0)
    return <p className="text-center mt-4">You have no reservations yet.</p>;

  return (
    <div>
      <div className="container-fluid orders-bg"></div>
      <div className="container">
        <h2 className="my-3">My Orders</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Boat</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr
                key={r._id}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/reservations/${r._id}`)}
              >
                <td>{r.boat?.name || "Deleted boat"}</td>
                <td>{new Date(r.startDate).toLocaleDateString()}</td>
                <td>{new Date(r.endDate).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`badge ${
                      r.status === "paid"
                        ? "bg-success"
                        : r.status === "pending"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td>{r.totalPrice ? `${r.totalPrice} €` : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
