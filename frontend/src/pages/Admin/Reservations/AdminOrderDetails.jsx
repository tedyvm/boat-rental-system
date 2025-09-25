import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

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
          `${import.meta.env.VITE_API_URL}/api/admin/reservations/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Fetch status:", res.status);
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data); // jei API gražina sąrašą
        setStatus(data.status || "");
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
        `${import.meta.env.VITE_API_URL}/api/admin/reservations/${id}/status`,
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
        <p
          onClick={() => navigate(`/admin/boats/${order.boat?._id}`)}
          style={{ cursor: "pointer" }}
        >
          <strong>Boat:</strong> {order.boat?.name}
        </p>
        <p
          onClick={() => navigate(`/admin/users/${order.user?._id}`)}
          style={{ cursor: "pointer" }}
        >
          <strong>User:</strong> {order.user?.username}
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(order.startDate).toLocaleDateString()}
        </p>
        <p>
          <strong>End Date:</strong>{" "}
          {new Date(order.endDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Current Status:</strong> {order.status}
        </p>
        <p>
          <strong>Total Price:</strong> ${order.totalPrice?.toFixed(2)}
        </p>
        <p>
          <strong>Payment Status:</strong> {order.isPaid ? "Paid" : "Not Paid"}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Comments:</strong> {order.comments || "No comments"}
        </p>

        <div className="mb-3">
          <label className="form-label fw-bold">Change Status</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="timed-out">Timed-out</option>
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
