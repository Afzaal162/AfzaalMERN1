// src/components/RegistrationOTP.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import "./OTP.css";

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [msg, setMsg] = useState("");

  const handleChange = (value, index) => {
    if (/^\d$/.test(value) || value === "") {
      const updated = [...otp];
      updated[index] = value;
      setOtp(updated);
    }
  };

  const handleVerify = async () => {
    const enteredOTP = otp.join("");

    try {
      const res = await api.post("/api/auth/verify-otp", {
        email,
        otp: enteredOTP,
      });

      if (res.data.success) {
        navigate("/success", {
          state: {
            message: "Account successfully verified!",
            redirectText: "Go to Login",
            redirectLink: "/login",
          },
        });
      } else {
        setMsg(res.data.message);
      }
    } catch (err) {
      console.log(err);
      setMsg("OTP verification failed");
    }
  };

  return (
    <div className="otp-container">
      <h2>Verify Your Email</h2>
      <p>We've sent a 6-digit OTP to {email}</p>

      <div className="otp-box">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            className="otp-input"
          />
        ))}
      </div>

      {msg && <p className="error">{msg}</p>}

      <button className="otp-btn" onClick={handleVerify}>
        Verify OTP
      </button>
    </div>
  );
};

export default OTP;
