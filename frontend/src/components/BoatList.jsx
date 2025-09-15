import { useEffect, useState } from "react";

export default function BoatList({ filters }) {
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoats = async () => {
      try {
        const query = new URLSearchParams(filters).toString();
        const res = await fetch(`http://localhost:5000/api/boats/search?${query}`);
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
  }, [filters]);

  if (loading) return <p>Kraunama...</p>;
  if (boats.length === 0) return <p>Laivų nerasta.</p>;

  return (
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
  );
}
