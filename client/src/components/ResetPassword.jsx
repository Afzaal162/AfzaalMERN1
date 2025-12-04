import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api"; // your axios instance
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Use email from state or fallback to localStorage
  const email = location.state?.email || localStorage.getItem("resetEmail");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Redirect if email missing
  useEffect(() => {
    if (!email) {
      alert("Email missing. Redirecting to Forgot Password.");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      setMsg("Please fill in both fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsg("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/reset-password", { email, newPassword });
      if (res.data.success) {
        // Clear the stored email
        localStorage.removeItem("resetEmail");
        alert("✅ Password reset successfully! Please login.");
        navigate("/login");
      } else {
        setMsg(res.data.message);
      }
    } catch (err) {
      console.log(err);
      setMsg(err.response?.data?.message || "Server Error");
    }
    setLoading(false);
  };

  if (!email) return null;

  return (
    <div className="reset-container">
      <div className="reset-box">
        <h1>Reset Password</h1>
        <p>Set a new password for <strong>{email}</strong></p>

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {msg && <p style={{ color: "red", marginTop: "10px" }}>{msg}</p>}

        <button onClick={handleReset} disabled={loading}>
          {loading ? "Resetting..." : "Set New Password"}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
