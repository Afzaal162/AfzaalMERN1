import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./OTP.css";

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  // Auto focus next input
  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); 
    setOtp(newOtp);

    if (value.length === 1 && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Backspace auto move left
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    const finalOTP = otp.join("");
    console.log("Sending:", { email, otp: finalOTP });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-otp`,
        { email, otp: finalOTP },
        { withCredentials: true }
      );

      console.log("OTP Verify Success:", res.data);

      if (res.data.success) {
        navigate("/reset-password", { state: { email } });
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error("OTP verify error:", error.response?.data || error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while verifying OTP"
      );
    }
  };

  return (
    <div className="otp-container">
      <h2>Enter OTP</h2>

      <div className="otp-inputs">
        {otp.map((value, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            maxLength="1"
            value={value}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>

      <button onClick={handleSubmit}>Verify OTP</button>
    </div>
  );
};

export default OTP;
