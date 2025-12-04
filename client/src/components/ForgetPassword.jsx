// src/components/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './ForgetPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return setMsg("Please enter your email");
    setLoading(true);
    setMsg("");

    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/request-password-reset",
        { email },
        { withCredentials: true }
      );

      if (response.data.success) {
        setMsg("OTP sent! Check your email.");
        // Redirect to OTP page for password reset
        navigate("/reset-password-otp", { state: { email } });
      } else {
        setMsg(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.log(err);
      setMsg(err.response?.data?.message || "Server error");
    }

    setLoading(false);
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h1>Forgot Password</h1>
        <p>Enter your email to reset your password</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Please wait..." : "Send OTP"}
        </button>

        {msg && <p style={{ color: "red", marginTop: "10px" }}>{msg}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
