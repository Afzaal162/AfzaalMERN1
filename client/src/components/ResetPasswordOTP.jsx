import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./OTP.css";

const ResetPasswordOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

  // Redirect if email missing
  useEffect(() => {
    if (!email) {
      alert("Email missing. Redirecting...");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  // Countdown Timer
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const timeout = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(timeout);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^[0-9]+$/.test(paste)) return;
    const newOtp = Array(6).fill("");
    paste.split("").forEach((char, idx) => (newOtp[idx] = char));
    setOtp(newOtp);
    inputsRef.current[Math.min(paste.length - 1, 5)]?.focus();
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      alert("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/verify-reset-otp`,
        { email, otp: enteredOtp },
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("OTP Verified Successfully!");
        navigate("/reset-password", { state: { email } });
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Server Error");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      await axios.post(
        `${API_URL}/api/auth/request-password-reset`,
        { email },
        { withCredentials: true }
      );

      alert("A new OTP has been sent!");
      setOtp(Array(6).fill(""));
      setTimer(60);
      setCanResend(false);
      inputsRef.current[0]?.focus();
    } catch (err) {
      alert("Failed to resend OTP");
    }
  };

  if (!email) return null;

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h1>Enter OTP</h1>
        <p>
          A 6-digit OTP has been sent to <strong>{email}</strong>
        </p>

        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((num, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={num}
              maxLength="1"
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        <div className="otp-footer">
          {!canResend ? (
            <p>Resend code in <b>{timer}s</b></p>
          ) : (
            <button onClick={handleResend}>Resend OTP</button>
          )}
        </div>

        <button onClick={handleVerify} disabled={loading} className="verify-btn">
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordOTP;
