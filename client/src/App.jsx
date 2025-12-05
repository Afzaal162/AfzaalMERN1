import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import OTP from "./components/OTP"; // ✅ Use existing OTP component
import ForgotPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";
import Success from "./components/Success";
import Welcome from "./components/Welcome";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<OTP />} />
        <Route path="/welcome" element={<Welcome />} />

        {/* Password Reset Flow */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* OTP for Password Reset */}
        <Route path="/reset-password-otp" element={<OTP />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/success"
          element={
            <Success
              message="Action completed successfully!"
              redirectText="Go to Login"
              redirectLink="/login"
            />
          }
        />
      </Routes>
    </Layout>
  );
};

export default App;
