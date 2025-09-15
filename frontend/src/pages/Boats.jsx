import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BoatFilters from "../components/BoatFilters";

export default function Boats() {
  const location = useLocation();
  const navigate = useNavigate();

  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchParams = new URLSearchParams(location.search);
  const initialFilters = Object.fromEntries(searchParams.entries());

  useEffect(() => {
    const fetchBoats = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/boats/search${location.search}`
        );
        if (!res.ok) throw new Error("Nepavyko gauti laivų sąrašo");
        const data = await res.json();
        setBoats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoats();
  }, [location.search]);

  const handleFiltersChange = (newFilters) => {
    const params = new URLSearchParams(newFilters).toString();
    navigate(`/boats?${params}`);
  };

  return (
    <div className="container py-4">
      <div className="row">
        {/* Filtrų stulpelis */}
        <aside className="col-md-3">
          <BoatFilters onChange={handleFiltersChange} initialValues={initialFilters} />
        </aside>

        {/* Laivų sąrašas */}
        <section className="col-md-9">
          {loading && <p>Kraunama...</p>}
          {!loading && boats.length === 0 && <p>Laivų nerasta.</p>}
          <div className="row">
            {boats.map((boat) => (
              <div key={boat._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                  {boat.images?.[0] && (
                    <img
                      src={boat.images[0]}
                      className="card-img-top"
                      alt={boat.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{boat.name}</h5>
                    <p className="card-text">
                      {boat.type} • {boat.capacity} vietų
                    </p>
                    <p className="fw-bold">{boat.pricePerDay} €/diena</p>
                    <a href={`/boats/${boat._id}`} className="btn btn-primary mt-auto">
                      Peržiūrėti
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
