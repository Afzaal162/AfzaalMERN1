import express from "express";
import {
    login,
    register,
    logout,
    verifyOtp,
    requestPasswordReset,
    verifyResetOtp,
    resetPassword
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/verify-otp", verifyOtp);

// Password Reset
authRouter.post("/request-password-reset", requestPasswordReset);
authRouter.post("/verify-reset-otp", verifyResetOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
