// server/nodeMailer/nodeMailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // load .env

// Create transporter
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Optional: verify transporter
transporter.verify((error, success) => {
  if (error) console.error("Transporter verification failed:", error);
  else console.log("Email transporter ready");
});

// Named export for sending emails
export const sendEmail = async ({ to, subject, html, text }) => {
  return await transporter.sendMail({
    from: `"Afzaal" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text,
  });
};
