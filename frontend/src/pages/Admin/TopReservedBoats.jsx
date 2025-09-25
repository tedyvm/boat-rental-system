import { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TopRevenueBoats() {
    const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBoats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/reports/top-reserved-boats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch top revenue boats");
      const data = await res.json();
      setBoats(data.boats);
    } catch (err) {
      console.error("❌ Failed to fetch top revenue boats", err);
      setBoats([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBoats();
  }, [fetchBoats]);

  return (
    <div className="container">
      <h2 className="my-3">Top Revenue Boats</h2>

      {loading ? (
        <p>Loading...</p>
      ) : boats.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Boat Name</th>
              <th>Type</th>
              <th>Total Revenue (€)</th>
            </tr>
          </thead>
          <tbody>
            {boats.map((boat) => (
              <tr key={boat.boatId} style={{ cursor: "pointer" }} onClick={() => navigate(`/admin/boats/${boat.boatId}`)}>
                <td>{boat.name}</td>
                <td>{boat.type}</td>
                <td>{boat.totalRevenue.toLocaleString("en-US", { style: "currency", currency: "EUR" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
