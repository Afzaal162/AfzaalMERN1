import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import "./ForgetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Email passed from OTP verification
  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        Email not found. Please request password reset first.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setMsg("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setMsg("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/reset-password", { email, password });

      if (res.data.success) {
        navigate("/success", {
          state: {
            message: `Password updated successfully for ${email}!`,
            redirectText: "Go to Login",
            redirectLink: "/login",
          },
        });
      } else {
        setMsg(res.data.message);
      }
    } catch (err) {
      console.error(err);
      setMsg("Failed to reset password. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h1>Reset Password</h1>
        <p>Enter a new password for <strong>{email}</strong></p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Reset Password"}
          </button>
        </form>
        {msg && <p style={{ color: "white" }}>{msg}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
