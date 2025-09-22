import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BoatFilters from "../components/BoatFilters";
import SearchBar from "../components/SearchBar";
import BoatList from "../components/BoatList";
import { AuthContext } from "../context/AuthContext";
import "../styles/Boats.css";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

export default function Boats({ isAdminView = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // ✅ Centralizuotas filters state – iš URL
  const [filters, setFilters] = useState(() =>
    Object.fromEntries(new URLSearchParams(location.search).entries())
  );

  // ✅ Centralizuotas sort
  const searchParams = new URLSearchParams(location.search);
  const currentSort = searchParams.get("sort");

  // ✅ Sinchronizuojam URL kai pasikeičia filters ar sort
  useEffect(() => {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(filters)) {
      if (value !== "" && value != null) params.set(key, value);
    }
    if (currentSort) params.set("sort", currentSort);

    navigate(`/boats?${params.toString()}`, { replace: true });
  }, [filters, currentSort, navigate]);

  const handleFiltersChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };

  const handleSortChange = (sortOption) => {
    const params = new URLSearchParams(location.search);
    if (sortOption) params.set("sort", sortOption);
    else params.delete("sort");
    navigate(`/boats?${params.toString()}`, { replace: true });
  };

  // ✅ Fetchinam kai pasikeičia location.search (URL)
  useEffect(() => {
    const fetchBoats = async () => {
      try {
        setLoading(true);

        const baseUrl = isAdminView
          ? "http://localhost:5000/api/admin/boats"
          : "http://localhost:5000/api/boats/search";

        const url = `${baseUrl}${location.search}`;
        const res = await fetch(url, {
          headers: isAdminView ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) throw new Error("Failed to fetch boats");

        const data = await res.json();
        setBoats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoats();
  }, [location.search, isAdminView, token]);

  return (
    <div className="boats-page">
      <div className="container-fluid boats-s1"></div>

      {/* Mobilus mygtukas */}
      <div className="boats-filter-button-wrapper d-block d-md-none text-end px-3">
        <Button variant="primary" onClick={handleShow} className="button">
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
            <SearchBar
              filters={filters}
              onChange={handleFiltersChange}
              showButton={false}
            />
            <BoatFilters filters={filters} onChange={handleFiltersChange} />
          </Offcanvas.Body>
        </Offcanvas>
      </div>

      {/* SearchBar */}
      <div className="container-fluid search-bar d-none d-md-block">
        <div className="container">
          <SearchBar
            filters={filters}
            onChange={handleFiltersChange}
            showButton={false}
          />
        </div>
      </div>

      <div className="container mt-4">
        <div className="row">
          <aside className="col-md-3 d-none d-md-block">
            <BoatFilters filters={filters} onChange={handleFiltersChange} />
          </aside>

          <section className="col-md-9">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <BoatList
                boats={boats}
                isAdminView={isAdminView}
                currentSort={currentSort}
                onSortChange={handleSortChange}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
