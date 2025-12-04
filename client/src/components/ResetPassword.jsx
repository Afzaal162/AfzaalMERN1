import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email; // Email from OTP verification
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email) {
    return (
      <div style={{ color: "white", textAlign: "center", fontSize: "20px" }}>
        ❌ Email missing — go back and try again.
      </div>
    );
  }

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Please fill in both fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/reset-password",
        { email, newPassword }, // send only email and newPassword
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("✅ Password reset successfully! Please login.");
        navigate("/login");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Server Error");
    }

    setLoading(false);
  };

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

        <button onClick={handleReset} disabled={loading}>
          {loading ? "Resetting..." : "Set New Password"}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
