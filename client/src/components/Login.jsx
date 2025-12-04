import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", { email, password });
      if (res.data.success) {
        localStorage.setItem("userEmail", email);
        localStorage.setItem("isLoggedIn", "true");
        navigate("/welcome", { state: { email } });
      } else {
        setMsg(res.data.message);
      }
    } catch (err) {
      console.log(err);
      setMsg("Login failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        <form onSubmit={handleLogin} class="login-form">
          <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Link to="/forgot-password">Forgot password?</Link>
          <button className="login-btn" type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
        {msg && <p style={{ color: "white" }}>{msg}</p>}
        <div>Don't have an account? <Link to="/register">Register</Link></div>
      </div>
    </div>
  );
};

export default Login;
