const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const mysql = require("mysql2/promise");

const missing = ["DB_USER", "DB_NAME"].filter((name) => !process.env[name]);
if (missing.length > 0) {
  throw new Error(`Set ${missing.join(" and ")} in backend/.env first.`);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
