import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  // State for user info
  const [userEmail, setUserEmail] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");

  useEffect(() => {
    // Check localStorage for login info
    const storedEmail = localStorage.getItem("userEmail");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn && storedEmail) {
      setUserEmail(storedEmail);
      setWelcomeMessage("Congratulations! You have become a member of Afzaal-Teach");
    }
  }, []);

  const handleLogout = () => {
    // Clear localStorage and state
    setUserEmail("");
    setWelcomeMessage("");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div className="home-container">
      <div className="home-content">
        {/* Logo Section */}
        <div className="home-logo">
          <div className="logo-icon">
            <span className="logo-bar"></span>
            <span className="logo-bar"></span>
            <span className="logo-bar"></span>
          </div>
          <span className="logo-text">auth</span>
        </div>

        {/* Hero Section */}
        <div className="hero-section">
     
            <>
              <h1 className="hero-title">
                Welcome to <span className="gradient-text">Modn Auth</span>
              </h1>
              <p className="hero-description">
                Secure, fast, and seamless authentication experience.
                Join thousands of users managing their accounts with ease.
              </p>
            </>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <h3>Secure</h3>
            <p>Bank-level encryption</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor"/>
              </svg>
            </div>
            <h3>Fast</h3>
            <p>Lightning quick access</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <h3>Reliable</h3>
            <p>99.9% uptime guarantee</p>
          </div>
        </div>

        {/* CTA Buttons */}
        {!userEmail && (
          <div className="cta-section">
            <Link to="/register" className="cta-link">
              <button className="btn primary-btn">
                <span>Get Started</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </button>
            </Link>

            <Link to="/login" className="cta-link">
              <button className="btn secondary-btn">
                Sign In
              </button>
            </Link>
          </div>
        )}

        {/* Footer Info */}
        <div className="home-footer">
          <p>Trusted by <strong>10,000+</strong> users worldwide</p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="decoration decoration-1"></div>
      <div className="decoration decoration-2"></div>
      <div className="decoration decoration-3"></div>
    </div>
  );
};

export default Home;
