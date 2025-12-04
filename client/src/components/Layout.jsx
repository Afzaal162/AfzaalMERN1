import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Layout.css";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove auth token
    setMobileMenuOpen(false);
    navigate("/login"); // redirect to login page
  };

  const isLoggedIn = !!localStorage.getItem("token");

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="layout-wrapper">
      {/* NAVBAR */}
      <nav className="navbar">

        <div className="navbar-container">
            <div>
          <span className="logo-text">auth</span>
        </div>

          {/* Desktop Navigation */}
          <div className="nav-links desktop-nav">
            <Link 
              to="/" 
              className={isActive("/") ? "nav-link active" : "nav-link"}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 10L10 3L17 10V17C17 17.5304 16.7893 18.0391 16.4142 18.4142C16.0391 18.7893 15.5304 19 15 19H5C4.46957 19 3.96086 18.7893 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 17V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              Home
            </Link>

            {!isLoggedIn && (
              <>
                <Link 
                  to="/login" 
                  className={isActive("/login") ? "nav-link active" : "nav-link"}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M14 14L18 10L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <path d="M18 10H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    <path d="M8 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  </svg>
                  Login
                </Link>

                <Link 
                  to="/register" 
                  className="nav-btn"
                >
                  Get Started
                </Link>
              </>
            )}

            {isLoggedIn && (
              <>
                <Link 
                  to="/dashboard" 
                  className={isActive("/dashboard") ? "nav-link active" : "nav-link"}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="2" y="2" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <rect x="11" y="2" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <rect x="2" y="11" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <rect x="11" y="11" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                  Dashboard
                </Link>

                <button className="logout-btn" onClick={handleLogout}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M6 14L2 10L6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <path d="M2 10H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    <path d="M12 2H16C16.5304 2 17.0391 2.21071 17.4142 2.58579C17.7893 2.96086 18 3.46957 18 4V16C18 16.5304 17.7893 17.0391 17.4142 17.4142C17.0391 17.7893 16.5304 18 16 18H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  </svg>
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <Link 
            to="/" 
            className={isActive("/") ? "nav-link active" : "nav-link"}
            onClick={closeMobileMenu}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 10L10 3L17 10V17C17 17.5304 16.7893 18.0391 16.4142 18.4142C16.0391 18.7893 15.5304 19 15 19H5C4.46957 19 3.96086 18.7893 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 17V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            Home
          </Link>

          {!isLoggedIn && (
            <>
              <Link 
                to="/login" 
                className={isActive("/login") ? "nav-link active" : "nav-link"}
                onClick={closeMobileMenu}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M14 14L18 10L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M18 10H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <path d="M8 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                </svg>
                Login
              </Link>

              <Link 
                to="/register" 
                className="nav-btn mobile"
                onClick={closeMobileMenu}
              >
                Get Started
              </Link>
            </>
          )}

          {isLoggedIn && (
            <>
              <Link 
                to="/dashboard" 
                className={isActive("/dashboard") ? "nav-link active" : "nav-link"}
                onClick={closeMobileMenu}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="2" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="11" y="2" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="2" y="11" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="11" y="11" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                Dashboard
              </Link>

              <button className="logout-btn mobile" onClick={handleLogout}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 14L2 10L6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M2 10H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <path d="M12 2H16C16.5304 2 17.0391 2.21071 17.4142 2.58579C17.7893 2.96086 18 3.46957 18 4V16C18 16.5304 17.7893 17.0391 17.4142 17.4142C17.0391 17.7893 16.5304 18 16 18H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                </svg>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="page-content">{children}</div>
    </div>
  );
};

export default Layout;