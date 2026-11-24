require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "BoardBuddy API" });
});

app.listen(port, () => {
  console.log(`BoardBuddy API is running on http://localhost:${port}`);
});
