require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");

if (!process.env.JWT_SECRET || Buffer.byteLength(process.env.JWT_SECRET) < 32) {
  throw new Error("Set a long JWT_SECRET in backend/.env before starting the API.");
}

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "BoardBuddy API" });
});

app.use("/api/auth", authRoutes);

app.use((error, _req, res, _next) => {
  console.error("API error:", error);
  res.status(500).json({ message: "Something went wrong. Please try again." });
});

app.listen(port, () => {
  console.log(`BoardBuddy API is running on http://localhost:${port}`);
});
