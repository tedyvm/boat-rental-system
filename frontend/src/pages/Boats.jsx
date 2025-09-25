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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [boatsPerPage, setBoatsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Mobilus filter panel
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Filters state iš URL
  const [filters, setFilters] = useState(() =>
    Object.fromEntries(new URLSearchParams(location.search).entries())
  );

  const searchParams = new URLSearchParams(location.search);
  const currentSort = searchParams.get("sort");

  //Sinchronizuojam URL kai pasikeičia filters / sort / pagination
  useEffect(() => {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(filters)) {
      if (value !== "" && value != null) params.set(key, value);
    }
    if (currentSort) params.set("sort", currentSort);

    params.set("page", currentPage);
    params.set("limit", boatsPerPage);

    navigate(`/boats?${params.toString()}`, { replace: true });
  }, [filters, currentSort, currentPage, boatsPerPage, navigate]);

  const handleFiltersChange = (updatedFilters) => {
    setFilters(updatedFilters);
    setCurrentPage(1); // reset į pirmą puslapį
  };

  const handleSortChange = (sortOption) => {
    const params = new URLSearchParams(location.search);
    if (sortOption) params.set("sort", sortOption);
    else params.delete("sort");
    navigate(`/boats?${params.toString()}`, { replace: true });
    setCurrentPage(1);
  };

  // Fetchinam kai pasikeičia URL
  useEffect(() => {
    const fetchBoats = async () => {
      try {
        setLoading(true);
        const baseUrl = isAdminView
          ? `${import.meta.env.VITE_API_URL}/api/admin/boats`
          : `${import.meta.env.VITE_API_URL}/api/boats/search`;

        const url = `${baseUrl}${location.search}`;
        const res = await fetch(url, {
          headers: isAdminView ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) throw new Error("Failed to fetch boats");
        const data = await res.json();

        if (Array.isArray(data)) {
          setBoats(data);
          setTotalPages(1);
          setTotal(data.length);
        } else {
          setBoats(data.boats || []);
          setTotalPages(data.pages || 1);
          setTotal(data.total || 0);
        }
      } catch (err) {
        console.error(err);
        setBoats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBoats();
  }, [location.search, isAdminView, token]);

  // ✅ Scrollinam į viršų kai keičiasi puslapis arba per-page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, boatsPerPage]);

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

      {/* Desktop search bar */}
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
            <div className="sticky-top" style={{ top: "20px" }}>
              <BoatFilters filters={filters} onChange={handleFiltersChange} />
            </div>
          </aside>

          <section className="col-md-9">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <BoatList
                  boats={boats}
                  isAdminView={isAdminView}
                  currentSort={currentSort}
                  onSortChange={handleSortChange}
                />

                {totalPages > 1 && (
                  <div className="d-flex justify-content-center align-items-center my-4 flex-wrap gap-2">
                    <button
                      className="btn btn-outline-secondary"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    >
                      &laquo; Prev
                    </button>

                    <span className="mx-2">
                      Page {currentPage} of {totalPages} ({total} boats)
                    </span>

                    <button
                      className="btn btn-outline-secondary"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                    >
                      Next &raquo;
                    </button>

                    <select
                      className="form-select w-auto"
                      value={boatsPerPage}
                      onChange={(e) => {
                        setBoatsPerPage(parseInt(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value={8}>8 per page</option>
                      <option value={16}>16 per page</option>
                      <option value={32}>32 per page</option>
                    </select>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
