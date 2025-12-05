import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import "./OTP.css";

const ResetPasswordOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else setCanResend(true);
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
    const nextEmpty = newOtp.findIndex(v => v === "");
    if (nextEmpty !== -1) inputsRef.current[nextEmpty]?.focus();
    else inputsRef.current[5]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOTP = otp.join("");
    if (!email) return alert("Email not found!");
    if (enteredOTP.length !== 6) return alert("Please enter all 6 digits");

    try {
      const res = await api.post("/api/auth/verify-reset-otp", { email, otp: enteredOTP });
      if (res.data.success) {
        navigate("/reset-password", { state: { email } });
      } else alert(res.data.message);
    } catch (err) {
      console.error("OTP verify error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "OTP verification failed. Try again.");
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await api.post("/api/auth/request-password-reset", { email });
      setOtp(["", "", "", "", "", ""]);
      setTimer(60);
      setCanResend(false);
      inputsRef.current[0]?.focus();
      alert(`OTP resent to ${email}`);
    } catch (err) {
      console.error("Resend OTP error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  if (!email) return <div style={{ color: "white", marginTop: "50px", textAlign: "center" }}>Email not found.</div>;

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h1>OTP Verification</h1>
        <p>We've sent a 6-digit code to <strong>{email}</strong></p>
        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((_, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={otp[idx]}
              ref={el => inputsRef.current[idx] = el}
              onChange={e => handleChange(e.target, idx)}
              onKeyDown={e => handleKeyDown(e, idx)}
              className={otp[idx] ? "filled" : ""}
            />
          ))}
        </div>
        <button onClick={handleSubmit}>Verify OTP</button>
        {!canResend ? (
          <p>Resend code in {timer}s</p>
        ) : (
          <button onClick={handleResend}>Resend OTP</button>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordOTP;
