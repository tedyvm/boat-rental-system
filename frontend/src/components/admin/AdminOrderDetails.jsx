import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function AdminOrderDetails() {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/admin/reservations?id=${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data.find((r) => r._id === id)); // jei API gražina sąrašą
        setStatus(data.find((r) => r._id === id)?.status || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  const handleStatusChange = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/reservations/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || "Failed to update status");
        return;
      }

      alert("Reservation status updated!");
      navigate("/admin/reservations");
    } catch (error) {
      console.error(error);
      alert("Error updating reservation status");
    }
  };

  if (loading) return <p>Loading order...</p>;
  if (!order) return <p className="text-danger">Order not found</p>;

  return (
    <div className="container mt-4">
      <h2>Order Details</h2>
      <div className="card p-3 shadow-sm">
        <p><strong>Boat:</strong> {order.boat?.name}</p>
        <p><strong>User:</strong> {order.user?.username}</p>
        <p><strong>Start Date:</strong> {new Date(order.startDate).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> {new Date(order.endDate).toLocaleDateString()}</p>
        <p><strong>Current Status:</strong> {order.status}</p>

        <div className="mb-3">
          <label className="form-label fw-bold">Change Status</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={handleStatusChange}>
          Save
        </button>
      </div>
    </div>
  );
}
