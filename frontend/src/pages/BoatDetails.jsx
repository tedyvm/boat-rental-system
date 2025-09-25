import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import AvailabilityMenu from "../components/AvailabilityMenu";
import { createReservation } from "../utils/reservation";
import StarRating from "../components/StarRating";
import ReviewList from "../components/ReviewList";
import "../styles/BoatDetails.css";

export default function BoatDetails() {
  const { id } = useParams();

  const [boat, setBoat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBoat() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/boats/${id}`);
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
  if (!boat) return <p className="text-danger">Boat not found.</p>;

  const galleryItems = boat.images.map((img) => ({
    original: img,
    thumbnail: img,
  }));

  async function handleReserve({ startDate, endDate }) {
    try {
      const reservation = await createReservation({
        boatId: boat._id,
        startDate,
        endDate,
      });

      alert("✅ Reservation created successfully!");
      console.log("📦 Reservation:", reservation);
    } catch (err) {
      alert(err.message);
      console.error("❌ Reservation error:", err);
    }
  }

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Availability sidebar */}
        <div className="col-md-3 order-2 order-md-1 availability-sidebar">
          <AvailabilityMenu
            pricePerDay={boat.pricePerDay}
            onReserve={handleReserve}
          />
        </div>

        {/* Main boat info */}
        <div className="col-md-9 order-1 order-md-2">
          <h2 className="mb-3">{boat.name}</h2>

          {/* Image gallery */}
          <div className="boat-gallery mb-4">
            <ImageGallery
              items={galleryItems}
              showPlayButton={false}
              showFullscreenButton={true}
              showNav={true}
            />
          </div>

          {/* Details card */}
          <div className="card shadow-sm p-3 mb-4">
            <div className="row">
              <div className="col-md-6">
                <p>
                  <strong>Type:</strong> {boat.type}
                </p>
                <p>
                  <strong>Location:</strong> {boat.location}
                </p>
                <p>
                  <strong>Year:</strong> {boat.year}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Capacity:</strong> 👥 {boat.capacity}
                </p>
                <p>
                  <strong>Cabins:</strong> 🛏 {boat.cabins}
                </p>
                <p>
                  <strong>Length:</strong> 📏 {boat.length} m
                </p>
                {boat.engine && (
                  <p>
                    <strong>Engine:</strong> ⚙ {boat.engine}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Price + description */}
          <p className="fs-5 fw-bold text-primary">
            Price: {boat.pricePerDay} €/day
          </p>

          <div className="mt-3">
            <h4>Description</h4>
            <p>{boat.description}</p>
          </div>
          <div className="mt-4">
            <h4 className="mb-2">Reviews</h4>

            {/* Žvaigždutės + bendras vidurkis */}
            <div className="d-flex align-items-center mb-3">
              <StarRating rating={boat.rating} size={24} />
              <span className="ms-2 text-muted">
                {boat.rating.toFixed(1)} / 5 ({boat.numberOfReviews} reviews)
              </span>
            </div>

            {/* Review sąrašas */}
            <ReviewList boatId={boat._id} />
          </div>
        </div>
      </div>
    </div>
  );
}
