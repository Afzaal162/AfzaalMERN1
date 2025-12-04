import dotenv from "dotenv";
dotenv.config(); // Must be first

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./route/authRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"], // allow both ports
  credentials: true, // Allow cookies to be sent
}));


// Routes
app.get("/", (req, res) => res.send("API IS WORKING"));
app.use("/api/auth", authRouter);

// Start server
app.listen(port, () =>
  console.log(`Server Has Been Activated on PORT ${port}`)
);
