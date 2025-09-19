import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header key={user?._id || "guest"} className="navbar-custom">
      <div className="navbar-container">
        {/* LOGO */}
        <Link to="/" className="navbar-logo col-md-3 col-sm-6">
          <img src="/images/logo.svg" alt="Logo" />
        </Link>

        {/* Kontaktai */}
        <div className="navbar-contacts col-md-6 d-none d-md-flex justify-content-center">
          <div className="contact-item">
            <svg
              width="32"
              height="34"
              viewBox="0 0 32 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M30.9991 24.4397V29.0342C31.0008 29.4607 30.9147 29.8829 30.7464 30.2737C30.5781 30.6645 30.3313 31.0153 30.0217 31.3037C29.7122 31.592 29.3467 31.8116 28.9488 31.9482C28.5508 32.0848 28.1292 32.1356 27.7108 32.0972C23.0692 31.5851 18.6106 29.9748 14.6934 27.3955C11.0488 25.0441 7.95889 21.9068 5.64301 18.2065C3.09379 14.2111 1.50736 9.66219 1.01224 4.92832C0.974549 4.50481 1.02412 4.07797 1.1578 3.67497C1.29149 3.27198 1.50635 2.90166 1.78871 2.5876C2.07108 2.27354 2.41475 2.02261 2.79786 1.8508C3.18097 1.67898 3.59512 1.59004 4.01394 1.58964H8.53912C9.27115 1.58233 9.98083 1.84552 10.5359 2.33017C11.0909 2.81482 11.4534 3.48786 11.5559 4.22383C11.7469 5.69417 12.1011 7.13786 12.6118 8.52735C12.8147 9.07552 12.8586 9.67126 12.7383 10.244C12.618 10.8167 12.3386 11.3424 11.933 11.7588L10.0173 13.7038C12.1646 17.538 15.2914 20.7127 19.0677 22.8929L20.9833 20.9479C21.3935 20.5361 21.9112 20.2523 22.4753 20.1302C23.0394 20.008 23.6262 20.0526 24.1661 20.2587C25.5346 20.7772 26.9565 21.1368 28.4046 21.3307C29.1374 21.4357 29.8065 21.8104 30.2849 22.3836C30.7633 22.9569 31.0174 23.6886 30.9991 24.4397Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>+370 66 151515</span>
          </div>
          <div className="contact-item">
            <svg
              width="32"
              height="28"
              viewBox="0 0 32 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 1.64151H28C29.65 1.64151 31 3.01492 31 4.69352V23.0056C31 24.6842 29.65 26.0576 28 26.0576H4C2.35 26.0576 1 24.6842 1 23.0056V4.69352C1 3.01492 2.35 1.64151 4 1.64151Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M31 4.69353L16 15.3756L1 4.69353"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>info@sailgo.com</span>
          </div>
        </div>

        {/* Dešinė pusė */}
        {!user ? (
          <button
            className="navbar-login col-md-3 col-sm-6 d-flex justify-content-end pe-3 btn btn-link text-white text-decoration-none"
            onClick={() => setShowLogin(true)}
          >
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              {/* login icon */}
            </svg>
            <span className="ms-2">Log In</span>
          </button>
        ) : (
          <div className="col-md-3 col-sm-6 d-flex justify-content-end align-items-center pe-3 position-relative">
            <span className="me-2 contact-item">
              Welcome, <b>{user.name || user.username}</b>
            </span>

            <button
              className="btn p-0"
              onClick={() => setMenuOpen((prev) => !prev)}
              style={{ background: "none", border: "none" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  color="white"
                  d="M3 6h18M3 12h18M3 18h18"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {menuOpen && (
              <div
                className="position-absolute bg-white border rounded shadow p-2"
                style={{ top: "100%", right: 0, zIndex: 1000 }}
              >
                <li className="nav-item">
                  <Link className="nav-link" to="/reservations/me">
                    My Orders
                  </Link>
                </li>
                <button
                  onClick={handleLogout}
                  className="btn btn-link text-danger text-decoration-none"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setShowLogin(false);
          }}
        />
      )}
    </header>
  );
}
