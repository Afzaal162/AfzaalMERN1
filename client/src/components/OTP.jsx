import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import './OTP.css';

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // get email from navigation state

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef([]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (el, idx) => {
    const value = el.value.replace(/[^0-9]/g, "");
    if (!value) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    if (idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (!otp[idx] && idx > 0) {
        const newOtp = [...otp];
        newOtp[idx - 1] = "";
        setOtp(newOtp);
        inputsRef.current[idx - 1]?.focus();
      } else if (otp[idx]) {
        const newOtp = [...otp];
        newOtp[idx] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    for (let i = 0; i < Math.min(pasted.length, 6); i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex((v) => v === "");
    if (nextEmpty !== -1) inputsRef.current[nextEmpty]?.focus();
    else inputsRef.current[5]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) return alert("Please enter all 6 digits");

    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/verify-otp",
        { email, otp: enteredOtp },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Save login info in localStorage
        localStorage.setItem("userEmail", email);
        localStorage.setItem("isLoggedIn", "true");

        // ✅ Redirect to Welcome page instead of Home
        navigate("/welcome", { state: { email } });
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("OTP verification failed. Try again.");
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(["", "", "", "", "", ""]);
    setTimer(60);
    setCanResend(false);
    inputsRef.current[0]?.focus();
    alert(`OTP resent to ${email}`);
  };

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!email) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        Email not found. Please register first.
      </div>
    );
  }

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h1>OTP Verification</h1>
        <p className="otp-description">
          We've sent a 6-digit code to<br />
          <strong>{email}</strong>
        </p>

        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((_, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={otp[idx]}
              ref={(el) => (inputsRef.current[idx] = el)}
              onChange={(e) => handleChange(e.target, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={otp[idx] ? "filled" : ""}
            />
          ))}
        </div>

        <button onClick={handleSubmit} className="verify-btn">Verify Code</button>

        <div className="otp-footer">
          {!canResend ? (
            <p className="timer-text">
              Resend code in <span className="timer">{formatTime(timer)}</span>
            </p>
          ) : (
            <button onClick={handleResend} className="resend-btn">Resend Code</button>
          )}
        </div>

        <div className="help-text">
          Didn't receive the code? Check your spam folder
        </div>
      </div>
    </div>
  );
};

export default OTP;
