const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
const googleClient = new OAuth2Client();

router.get("/google-config", (_req, res) => {
  res.json({ clientId: process.env.GOOGLE_CLIENT_ID || null });
});

function publicUser(user) {
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
  };
}

function makeToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    algorithm: "HS256",
    issuer: "boardbuddy",
    subject: String(userId),
    expiresIn: "1d",
  });
}

router.post("/register", async (req, res) => {
  const { full_name, email, password, role } = req.body || {};
  const name = typeof full_name === "string" ? full_name.trim() : "";
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (name.length < 2 || name.length > 150) {
    return res.status(400).json({ message: "Full name must be 2 to 150 characters." });
  }
  if (normalizedEmail.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }
  if (typeof password !== "string" || password.length < 8 || Buffer.byteLength(password) > 72) {
    return res.status(400).json({ message: "Password must be at least 8 characters and at most 72 bytes." });
  }
  if (role !== "landlord" && role !== "tenant") {
    return res.status(400).json({ message: "Choose landlord or tenant." });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  let result;
  try {
    [result] = await pool.execute(
      "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [name, normalizedEmail, passwordHash, role]
    );
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email is already registered." });
    }
    throw error;
  }

  const user = { id: result.insertId, full_name: name, email: normalizedEmail, role };
  res.status(201).json({ token: makeToken(user.id), user });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!normalizedEmail || typeof password !== "string" || !password) {
    return res.status(400).json({ message: "Enter your email and password." });
  }

  const [rows] = await pool.execute(
    "SELECT id, full_name, email, password_hash, role FROM users WHERE email = ? LIMIT 1",
    [normalizedEmail]
  );
  const user = rows[0];
  if (!user || !user.password_hash || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  res.json({ token: makeToken(user.id), user: publicUser(user) });
});

router.post("/google", async (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(503).json({ message: "Google sign-in is not set up yet." });
  }

  const { credential, role } = req.body || {};
  if (typeof credential !== "string" || !credential || credential.length > 8192) {
    return res.status(400).json({ message: "Google sign-in did not return a valid token." });
  }

  let profile;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    profile = ticket.getPayload();
  } catch {
    return res.status(401).json({ message: "Google sign-in failed. Please try again." });
  }

  if (!profile?.email_verified || !profile.sub || !profile.email) {
    return res.status(401).json({ message: "Google did not verify this email address." });
  }

  const email = profile.email.trim().toLowerCase();
  const name = (profile.name || email.split("@")[0]).trim().slice(0, 150);
  if (email.length > 255 || profile.sub.length > 255 || name.length < 2) {
    return res.status(400).json({ message: "Google account details are incomplete." });
  }

  const [googleUsers] = await pool.execute(
    "SELECT id, full_name, email, role FROM users WHERE google_id = ? LIMIT 1",
    [profile.sub]
  );
  if (googleUsers.length > 0) {
    const user = googleUsers[0];
    return res.json({ token: makeToken(user.id), user });
  }

  const [emailUsers] = await pool.execute("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
  if (emailUsers.length > 0) {
    return res.status(409).json({
      message: "This email already has a password account. Sign in with your password.",
    });
  }

  if (role !== "landlord" && role !== "tenant") {
    return res.status(409).json({
      code: "ROLE_REQUIRED",
      message: "Register first and choose Landlord or Tenant.",
    });
  }

  let result;
  try {
    [result] = await pool.execute(
      "INSERT INTO users (full_name, email, password_hash, google_id, role) VALUES (?, ?, NULL, ?, ?)",
      [name, email, profile.sub, role]
    );
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Account already exists. Please try signing in." });
    }
    throw error;
  }

  const user = { id: result.insertId, full_name: name, email, role };
  res.status(201).json({ token: makeToken(user.id), user });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
