import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send request to backend
      const response = await axios.post(
        "http://localhost:4000/api/auth/register",
        {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setMsg("Verification email sent!");

        // ✅ Redirect to OTP verification page using React Router state (not query)
        navigate("/verify-otp", { state: { email: formData.email } });
      } else {
        setMsg(response.data.message);
      }
    } catch (err) {
      console.log(err);
      setMsg("Registration failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-form-wrapper">
          <h1 className="form-title">Create Account</h1>
          <p className="form-subtitle">Create your account</p>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <svg
                className="input-icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z"
                  fill="currentColor"
                  opacity="0.5"
                />
                <path
                  d="M10 12C4.47715 12 0 14.4772 0 17.5C0 18.8807 4.47715 20 10 20C15.5228 20 20 18.8807 20 17.5C20 14.4772 15.5228 12 10 12Z"
                  fill="currentColor"
                  opacity="0.5"
                />
              </svg>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <svg
                className="input-icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M2 4C2 2.89543 2.89543 2 4 2H16C17.1046 2 18 2.89543 18 4V16C18 17.1046 17.1046 18 16 18H4C2.89543 18 2 17.1046 2 16V4Z"
                  fill="currentColor"
                  opacity="0.5"
                />
                <path
                  d="M2 4L10 11L18 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <input
                type="email"
                name="email"
                placeholder="Email id"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <svg
                className="input-icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M5 8V6C5 3.23858 7.23858 1 10 1C12.7614 1 15 3.23858 15 6V8"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <rect
                  x="3"
                  y="8"
                  width="14"
                  height="11"
                  rx="2"
                  fill="currentColor"
                  opacity="0.5"
                />
                <circle cx="10" cy="13" r="1.5" fill="white" />
              </svg>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Please wait..." : "Sign Up"}
            </button>
          </form>

          {msg && (
            <p style={{ color: "white", marginTop: "10px", textAlign: "center" }}>
              {msg}
            </p>
          )}

          <div className="form-footer">
            <div className="login-text">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
