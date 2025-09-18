import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/BoatList.css";

export default function BoatList({ boats, currentSort, onSortChange }) {
  const location = useLocation();
  const [showSortMenu, setShowSortMenu] = useState(false);
  const dropdownRef = useRef(null);

  // uždarom dropdown paspaudus už ribų
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSortMenu(false);
      }
    }
    if (showSortMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSortMenu]);

  if (!boats || boats.length === 0) {
    return <p>No boats found. Try different filters.</p>;
  }

  return (
    <>
      {/* Sort dropdown */}
      <div className="row mb-3">
        <div
          className="col d-flex align-items-center pb-3 position-relative"
          ref={dropdownRef}
        >
          <p className="me-2 mb-0">
            Sort by:{" "}
            <strong>
              {currentSort === "price-asc" && "Price (Low → High)"}
              {currentSort === "price-desc" && "Price (High → Low)"}
              {currentSort === "capacity" && "Capacity"}
              {!currentSort && "—"}
            </strong>
          </p>
          <svg
            onClick={() => setShowSortMenu((prev) => !prev)}
            style={{ cursor: "pointer" }}
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="27"
              height="27"
              rx="2.5"
              fill="white"
              stroke="#001228"
            />
            <path
              d="M8 11L14 17L20 11"
              stroke="#001228"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {showSortMenu && (
            <div className="sort-dropdown shadow-sm">
              <button
                className="dropdown-item"
                onClick={() => onSortChange(null)}
              >
                No sorting
              </button>
              <button
                className="dropdown-item"
                onClick={() => onSortChange("price-asc")}
              >
                Price (Low → High)
              </button>
              <button
                className="dropdown-item"
                onClick={() => onSortChange("price-desc")}
              >
                Price (High → Low)
              </button>
              <button
                className="dropdown-item"
                onClick={() => onSortChange("capacity")}
              >
                Capacity
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Kortelės */}
      <div className="row">
        {boats.map((boat) => (
          <div key={boat._id} className="col-md-6 mb-4">
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
                <p className="card-text">
                  👥 x {boat.capacity} | 🛏 x {boat.cabins}
                </p>
                <p className="fw-bold ms-auto">From {boat.pricePerDay} €/day</p>
                <a
                  href={`/boats/${boat._id}${location.search}`}
                  className="btn btn-primary ms-auto button"
                >
                  More details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
