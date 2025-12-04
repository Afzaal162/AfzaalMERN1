// authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/usermodel.js";
import { sendEmail } from "../nodeMailer/nodeMailer.js";

// -------------------- Register --------------------
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.json({ success: false, message: "Missing Details" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.json({ success: false, message: "User Already Exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpireAt = new Date(Date.now() + 10 * 60 * 1000);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      verifyOtp: otp,
      verifyOtpExpireAt: otpExpireAt,
      isAccountVerified: false,
    });

    await user.save();

    await sendEmail({
      to: email,
      subject: "Welcome! Verify Your Email",
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Verify your email using this OTP:</p>
        <h2>${otp}</h2>
        <p>This OTP expires in 10 minutes.</p>
      `,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "User registered. Check email for OTP.",
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// -------------------- Verify OTP --------------------
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ success: false, message: "Email & OTP required" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (user.isAccountVerified)
      return res.status(400).json({ success: false, message: "Account already verified" });

    if (user.verifyOtp !== otp || user.verifyOtpExpireAt < new Date())
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

    user.isAccountVerified = true;
    user.verifyOtp = null;
    user.verifyOtpExpireAt = null;
    await user.save();

    res.json({ success: true, message: "Account verified successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- Login --------------------
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.json({ success: false, message: "Email & Password required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "Invalid Email" });

    if (!user.isAccountVerified)
      return res.json({ success: false, message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid Password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// -------------------- Logout --------------------
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res.json({ success: true, message: "Logged Out" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// -------------------- Forgot Password: Request OTP --------------------
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User not found" });

    const otp = crypto.randomInt(100000, 999999).toString();

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      to: email,
      subject: "Password Reset OTP",
      html: `<h2>Your Password Reset OTP: ${otp}</h2>`,
    });

    res.json({ success: true, message: "Reset OTP sent to email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// -------------------- Forgot Password: Verify OTP --------------------
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User not found" });

    if (user.resetOtp !== otp)
      return res.json({ success: false, message: "Invalid OTP" });

    if (user.resetOtpExpireAt < Date.now())
      return res.json({ success: false, message: "OTP expired" });

    res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// -------------------- Forgot Password: Reset Password --------------------
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.json({ success: false, message: "Missing details" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User not found" });

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);

    // Clear OTP fields
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


