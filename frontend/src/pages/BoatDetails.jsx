import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import AvailabilityMenu from "../components/AvailabilityMenu";
import { createReservation } from "../utils/reservation";

export default function BoatDetails() {
  const { id } = useParams();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const [boat, setBoat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBoat() {
      try {
        console.log("🚀 Fetching boat:", id); // ✅ CHANGED (debug log)
        const res = await fetch(`http://localhost:5000/api/boats/${id}`);
        if (!res.ok) throw new Error("Boat not found");
        const data = await res.json();
        setBoat(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBoat();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!boat) return <p>Boat not found.</p>;

  const galleryItems = boat.images.map((img) => ({
    original: img,
    thumbnail: img,
  }));

  async function handleReserve({ startDate, endDate }) {
    // ✅ CHANGED: vietoj tiesioginio fetch naudojam createReservation helperį
    try {
      const reservation = await createReservation({
        boatId: boat._id,
        startDate,
        endDate,
      });

      alert("✅ Reservation created successfully!");
      console.log("📦 Reservation:", reservation);
      // navigate("/my-reservations"); // jei reikia peradresuoti
    } catch (err) {
      alert(err.message);
      console.error("❌ Reservation error:", err);
    }
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3 d-12 order-2 order-md-1">
          <AvailabilityMenu
            pricePerDay={boat.pricePerDay}
            onReserve={handleReserve}
          />
        </div>

        <div className="col-md-9 order-1 order-md-2">
          <h2>{boat.name}</h2>

          <div className="boat-gallery mb-4">
            <ImageGallery
              items={galleryItems}
              showPlayButton={false}
              showFullscreenButton={true}
              showNav={true}
            />
          </div>

          <p>
            <strong>Type: </strong>
            {boat.type === "katamaranas"
              ? "Catamaran"
              : boat.type === "jachta"
              ? "Sailing Yacht"
              : boat.type === "motorinis"
              ? "Motorboat"
              : boat.type === "valtis"
              ? "Small Boat"
              : boat.type}
          </p>
          <p>
            <strong>Capacity:</strong> {boat.capacity}
          </p>
          <p>
            <strong>Cabins:</strong> {boat.cabins}
          </p>
          <p>
            <strong>Price:</strong> {boat.pricePerDay} €/day
          </p>
          <p>{boat.description}</p>
        </div>
      </div>
    </div>
  );
}
