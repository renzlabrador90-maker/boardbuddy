const jwt = require("jsonwebtoken");
const pool = require("../config/db");

async function requireAuth(req, res, next) {
  const header = req.get("Authorization") || "";
  const match = /^Bearer (\S+)$/i.exec(header);
  if (!match) return res.status(401).json({ message: "Please sign in." });

  let payload;
  try {
    payload = jwt.verify(match[1], process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "boardbuddy",
    });
  } catch {
    return res.status(401).json({ message: "Your session is invalid or expired. Please sign in again." });
  }

  const userId = Number(payload.sub);
  if (!Number.isSafeInteger(userId) || userId < 1) {
    return res.status(401).json({ message: "Your session is invalid. Please sign in again." });
  }

  const [rows] = await pool.execute(
    "SELECT id, full_name, email, role FROM users WHERE id = ?",
    [userId]
  );
  if (rows.length === 0) {
    return res.status(401).json({ message: "Account not found. Please sign in again." });
  }

  req.user = rows[0];
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Please sign in." });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have access to this page." });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
