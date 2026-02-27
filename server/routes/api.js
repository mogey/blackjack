import express from "express";
import { User, hashPin, verifyPin } from "../index.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, pin } = req.body;

  if (!username || !pin) {
    return res.status(400).json({ error: "Username and pin are required" });
  }
  if (username.length < 2 || username.length > 20) {
    return res.status(400).json({ error: "Username must be 2-20 characters" });
  }
  if (pin.toString().length < 4) {
    return res.status(400).json({ error: "Pin must be at least 4 digits" });
  }

  const existing = await User.findOne({
    where: { username: username.toLowerCase() },
  });
  if (existing) {
    return res.status(409).json({ error: "Username already taken" });
  }

  const pinHash = hashPin(pin);
  const user = await User.create({
    username: username.toLowerCase(),
    pinHash,
    balance: 1000,
  });

  console.log("API | Registered user:", user.username);
  res.json({
    id: user.id,
    username: user.username,
    balance: parseInt(user.balance),
  });
});

router.post("/login", async (req, res) => {
  const { username, pin } = req.body;

  if (!username || !pin) {
    return res.status(400).json({ error: "Username and pin are required" });
  }

  const user = await User.findOne({
    where: { username: username.toLowerCase() },
  });
  if (!user) {
    return res.status(401).json({ error: "Invalid username or pin" });
  }

  if (!verifyPin(pin, user.pinHash)) {
    return res.status(401).json({ error: "Invalid username or pin" });
  }

  console.log("API | User logged in:", user.username);
  res.json({
    id: user.id,
    username: user.username,
    balance: parseInt(user.balance),
  });
});

router.get("/balance", async (req, res) => {
  const userId = req.headers.authorization;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ balance: parseInt(user.balance) });
});

export default router;
