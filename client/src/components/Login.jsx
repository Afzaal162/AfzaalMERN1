import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLogIn } from "react-icons/fi";
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          email: formData.email,
          password: formData.password
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Save login info in localStorage
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("isLoggedIn", "true");

        // Redirect to Welcome or Home page
        navigate("/welcome", { state: { email: formData.email } });
      } else {
        setMsg(response.data.message || "Login failed");
      }
    } catch (err) {
      console.log(err);
      setMsg(err.response?.data?.message || "Server error. Try again.");
    }

    setLoading(false);
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password"); // Redirect to forgot password page
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">
          <FiLogIn size={40} />
        </div>
        <h1 className="login-title">Login</h1>
        <p className="login-subtitle">Sign in to your account</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="forgot-password" onClick={handleForgotPassword}>
            Forgot password?
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>

        {msg && <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>{msg}</p>}

        <div className="divider">OR</div>

        <p className="login-footer">
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
