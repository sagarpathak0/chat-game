import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import pool from "../config/config.js"; 
import { check, validationResult } from "express-validator";
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // Store password in an environment variable
  },
});

// Temporary storage for OTP (consider using Redis for production)
let otpStore = {};

// Route: Send OTP to user's email
router.post("/send-otp", [
  check("email", "Please enter a valid email").isEmail(),
], async (req, res) => {
  const { email } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already exists
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already registered" });
    }

    // Generate and store OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = { otp, timestamp: Date.now() };

    // Send OTP via email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your OTP for Registration',
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to send OTP" });
      }

      res.status(200).json({ message: "OTP sent successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route: Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!otpStore[email]) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    const record = otpStore[email];
    const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

    if (Date.now() - record.timestamp > OTP_EXPIRY_TIME) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired" });
    }

    if (Number(otp) !== record.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    delete otpStore[email];
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route: Register User (after OTP verification)
router.post("/register", [
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Password is required").not().isEmpty(),
], async (req, res) => {
  const { name, email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route: Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.rows[0].id, isAdmin: false }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const name = user.rows[0].name;

    res.status(200).json({ message: "Login successful", token, name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route: Register Admin
router.post("/register-admin", [
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Password is required").not().isEmpty(),
], async (req, res) => {
  const { name, email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const adminExists = await pool.query("SELECT * FROM admin WHERE email = $1", [email]);
    if (adminExists.rows.length > 0) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO admin (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route: Login Admin
router.post("/login-admin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await pool.query("SELECT * FROM admin WHERE email = $1", [email]);
    if (admin.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin.rows[0].id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const name = admin.rows[0].name;

    res.status(200).json({ message: "Login successful", token, name, isAdmin: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
