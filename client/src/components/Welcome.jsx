import React from "react";
import './Welcome.css'
import { useNavigate, useLocation } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "User";

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div className="welcome-page">
      <h1>🎉 Congratulations!</h1>
      <p>You are now signed in as <strong>{email}</strong></p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Welcome;
