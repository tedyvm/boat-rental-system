import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

export default function AdminBoatDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [boat, setBoat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBoat = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/admin/boats/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch boat");
        const data = await res.json();
        setBoat({ ...data, images: data.images || [] });
      } catch (err) {
        console.error(err);
        setError("Could not load boat");
      } finally {
        setLoading(false);
      }
    };

    fetchBoat();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBoat((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      const res = await fetch(`http://localhost:5000/api/admin/boats/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` },
        body: JSON.stringify(boat),
      });
      if (!res.ok) throw new Error("Failed to update boat");
      await res.json();
      navigate("/admin/boats");
    } catch (err) {
      console.error(err);
      setError("Could not save boat changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading boat...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!boat) return <p>Boat not found</p>;

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
      <h2 className="my-3">Edit Boat</h2>

      {/* react-image-gallery */}
      {boat.images.length > 0 ? (
        <ImageGallery
          items={galleryItems}
          showPlayButton={false}
          showFullscreenButton={true}
          additionalClass="mb-3"
        />
      ) : (
        <p className="text-muted">No images yet.</p>
      )}

      <form onSubmit={handleSubmit}>
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

        {/* Kiti formos laukai (name, type, description...) */}

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={boat.name}
            onChange={handleChange}
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
            <option value="yacht">Yacht</option>
            <option value="motor">Motor Boat</option>
            <option value="sailboat">Sailboat</option>
          </select>
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

        <div className="mb-3">
          <label className="form-label">Price Per Day</label>
          <input
            type="number"
            name="pricePerDay"
            className="form-control"
            value={boat.pricePerDay}
            onChange={handleChange}
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
          {saving ? "Saving..." : "Save Changes"}
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
