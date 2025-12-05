import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import api from "../api"; 
import "./ForgetPassword.css"; 

const ForgotPassword = () => { 
  const navigate = useNavigate(); 
  const [email, setEmail] = useState(""); 
  const [msg, setMsg] = useState(""); 
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    setLoading(true); 
    try { 
      const res = await api.post("/api/auth/request-password-reset", { email }); 
      if (res.data.success) { 
        // ✅ IMPORTANT 
        navigate("/verify-otp", { state: { email, flowType: "forgot" } }); 
      } else { 
        setMsg(res.data.message); 
      } 
    } catch (err) { 
      console.log(err); 
      setMsg("Request failed. Try again."); 
    } 
    setLoading(false); 
  }; 

  return ( 
    <div className="forgot-container"> 
      <div className="forgot-card"> 
        <h1>Forgot Password</h1> 
        <form onSubmit={handleSubmit}> 
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          /> 
          <button type="submit" disabled={loading}> 
            {loading ? "Please wait..." : "Send OTP"} 
          </button> 
        </form> 
        {msg && <p style={{ color: "white" }}>{msg}</p>} 
      </div> 
    </div> 
  ); 
}; 

export default ForgotPassword;
