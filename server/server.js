import dotenv from "dotenv";
dotenv.config(); // Must be first

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./route/authRoutes.js";

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS setup
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(url => url.trim())
  : [];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Redirect root "/" to frontend
app.get("/", (req, res) => {
  res.redirect("https://afzaal-mern-1-43wc.vercel.app/"); // Your frontend URL
});

// API Routes
app.use("/api/auth", authRouter);

// Export app for Vercel (no app.listen)
export default app;
