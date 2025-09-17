import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BoatFilters from "../components/BoatFilters";
import SearchBar from "../components/SearchBar";
import "../styles/Boats.css";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

export default function Boats() {
  const location = useLocation();
  const navigate = useNavigate();
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showSortMenu, setShowSortMenu] = useState(false);
  const dropdownRef = useRef(null);

  const searchParams = new URLSearchParams(location.search);
  const currentSort = searchParams.get("sort");

  const handleFiltersChange = (filters) => {
    const params = new URLSearchParams(filters);
    if (currentSort) params.set("sort", currentSort); // išlaikom rūšiavimą
    navigate(`/boats?${params.toString()}`);
  };

  const handleSortChange = (sortOption) => {
    const params = new URLSearchParams(location.search);
    params.set("sort", sortOption);
    navigate(`/boats?${params.toString()}`);
    setShowSortMenu(false);
  };

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

  return (
    <div className="boats-page">
      <div className="container-fluid boats-s1"></div>

      {/* Mobilus mygtukas */}
      <div className="boats-filter-button-wrapper d-block d-md-none text-end px-3">
        <Button variant="primary" onClick={handleShow}>
          Filters
        </Button>

        <Offcanvas
          show={show}
          onHide={handleClose}
          placement="end"
          className="boats-offcanvas"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Filters</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <BoatFilters
              onChange={handleFiltersChange}
              initialValues={Object.fromEntries(
                new URLSearchParams(location.search).entries()
              )}
            />
          </Offcanvas.Body>
        </Offcanvas>
      </div>

      {/* SearchBar */}
      <div className="container-fluid search-bar d-none d-md-block">
        <div className="container">
          <SearchBar showButton={false} onFiltersChange={handleFiltersChange} />
        </div>
      </div>

      <div className="container mt-4">
        <div className="row">
          {/* Filtrai */}
          <aside className="col-md-3 d-none d-md-block">
            <BoatFilters
              onChange={handleFiltersChange}
              initialValues={Object.fromEntries(
                new URLSearchParams(location.search).entries()
              )}
            />
          </aside>

          {/* Laivai */}
          <section className="col-md-9">
            {loading && <p>Loading...</p>}
            {!loading && boats.length === 0 && (
              <p>No boats found. Try different filters.</p>
            )}

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
                      onClick={() => handleSortChange(null)}
                    >
                      No sorting
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => handleSortChange("price-asc")}
                    >
                      Price (Low → High)
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => handleSortChange("price-desc")}
                    >
                      Price (High → Low)
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => handleSortChange("capacity")}
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
                      <p className="card-text">{boat.type}</p>
                      <p className="card-text">
                        👥 x {boat.capacity} | 🛏 x {boat.cabins}
                      </p>
                      <p className="fw-bold">{boat.pricePerDay} €/day</p>
                      <a
                        href={`/boats/${boat._id}`}
                        className="btn btn-primary mt-auto"
                      >
                        Details
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
