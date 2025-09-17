import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

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

  async function handleReserve() {
    if (!startDate || !endDate) {
      alert("Please select start and end dates first.");
      return;
    }

    const token = localStorage.getItem("token"); // arba sessionStorage
    if (!token) {
      alert("You must be logged in to reserve a boat.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ← svarbu!
        },
        body: JSON.stringify({
          boatId: boat._id,
          startDate,
          endDate,
        }),
      });

      if (!response.ok) throw new Error("Reservation failed");

      const data = await response.json();
      alert("Reservation created successfully!");
      console.log(data);
      // redirect jei reikia:
      // navigate("/my-reservations");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="container py-4">
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
        <strong>Type:</strong> {boat.type}
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
      {startDate && endDate && (
        <p className="text-success">
          Selected period: <strong>{startDate}</strong> →{" "}
          <strong>{endDate}</strong>
        </p>
      )}
      <button className="btn btn-primary" onClick={handleReserve}>
        Reserve now
      </button>
    </div>
  );
}
