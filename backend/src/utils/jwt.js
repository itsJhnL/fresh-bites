const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  throw new Error(
    "JWT_SECRET is missing or too short. Set a long random value in .env."
  );
}

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function signToken(user) {
  // Keep the payload minimal — id and role are all any route needs.
  return jwt.sign({ sub: user.id, role: user.role }, SECRET, {
    expiresIn: EXPIRES_IN,
  });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { signToken, verifyToken };
