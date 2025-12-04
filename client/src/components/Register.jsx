import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; // use centralized axios instance
import './Register.css'
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/auth/register", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        setMsg("Verification email sent!");
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
          <h1>Create Account</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <input className="input" type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
            <input className="input" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input className="input" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <Link to="/forgot-password">Forgot password?</Link>
            <button className="submit-btn" type="submit" disabled={loading}>{loading ? "Please wait..." : "Sign Up"}</button>
          </form>
          {msg && <p style={{ color: "white" }}>{msg}</p>}
          <div>Already have an account? <Link to="/login">Login</Link></div>
        </div>
      </div>
    </div>
  );
};

export default Register;
