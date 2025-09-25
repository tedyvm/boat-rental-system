import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

export default function AdminAddBoat() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [boat, setBoat] = useState({
    name: "",
    type: "Catamaran",
    location: "",
    year: new Date().getFullYear(),
    length: 10,
    cabins: 0,
    engine: "",
    description: "",
    pricePerDay: 0,
    capacity: 1,
    withCaptain: false,
    status: "draft",
    images: [],
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBoat((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    for (const file of files) {
      const base64 = await fileToBase64(file);
      newImages.push(base64);
    }

    setBoat((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));

    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    setBoat((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...boat,
        year: Number(boat.year),
        length: Number(boat.length),
        cabins: Number(boat.cabins),
        engine: Number(boat.engine),
        pricePerDay: Number(boat.pricePerDay),
        capacity: Number(boat.capacity),
      };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/boats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create boat");

      await res.json();
      navigate("/admin/boats");
    } catch (err) {
      console.error(err);
      setError("Could not create boat");
    } finally {
      setSaving(false);
    }
  };

  const galleryItems = boat.images.map((img, index) => ({
    original: img,
    thumbnail: img,
    description: (
      <button
        type="button"
        className="btn btn-sm btn-danger"
        onClick={() => handleRemoveImage(index)}
      >
        Remove
      </button>
    ),
  }));

  return (
    <div className="container">
      <h2 className="my-3">Add New Boat</h2>

      {boat.images.length > 0 && (
        <ImageGallery
          items={galleryItems}
          showPlayButton={false}
          showFullscreenButton={true}
          additionalClass="mb-3"
        />
      )}

      <form onSubmit={handleSubmit}>
        {/* Images */}
        <div className="mb-3">
          <label className="form-label">Add Images</label>
          <input
            type="file"
            multiple
            className="form-control"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        {/* Basic info */}
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={boat.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Type</label>
          <select
            name="type"
            className="form-select"
            value={boat.type}
            onChange={handleChange}
          >
            <option value="Catamaran">Catamaran</option>
            <option value="Sailing Yacht">Sailing Yacht</option>
            <option value="Speed Boat">Speed Boat</option>
            <option value="Small Boat">Small Boat</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Location</label>
          <input
            type="text"
            name="location"
            className="form-control"
            value={boat.location}
            onChange={handleChange}
          />
        </div>

        {/* Technical specs */}
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Year</label>
            <input
              type="number"
              name="year"
              className="form-control"
              value={boat.year}
              min="1980"
              max={new Date().getFullYear()}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">Length (m)</label>
            <input
              type="number"
              step="0.1"
              name="length"
              className="form-control"
              value={boat.length}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">Cabins</label>
            <input
              type="number"
              name="cabins"
              className="form-control"
              value={boat.cabins}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Engine</label>
          <input
            type="text"
            name="engine"
            className="form-control"
            value={boat.engine}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={boat.description}
            onChange={handleChange}
          />
        </div>

        {/* Pricing & status */}
        <div className="mb-3">
          <label className="form-label">Price Per Day (€)</label>
          <input
            type="number"
            name="pricePerDay"
            className="form-control"
            value={boat.pricePerDay}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Capacity</label>
          <input
            type="number"
            name="capacity"
            className="form-control"
            value={boat.capacity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="withCaptain"
            className="form-check-input"
            checked={boat.withCaptain}
            onChange={handleChange}
          />
          <label className="form-check-label">With Captain</label>
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            name="status"
            className="form-select"
            value={boat.status}
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {error && <p className="text-danger">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Creating..." : "Create Boat"}
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/admin/boats")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
