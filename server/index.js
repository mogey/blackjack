import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import Sequelize from "sequelize";
import crypto from "crypto";
import { setupSocketHandlers } from "./game/tableManager.js";

dotenv.config();
const { DataTypes } = Sequelize;

// --- Database ---
export const sequelizeInstance = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER_ACCOUNT,
  process.env.MYSQL_USER_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    logging: false,
  }
);

// Retry DB connection until MySQL is ready
async function connectWithRetry(maxRetries = 10, delayMs = 3000) {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      await sequelizeInstance.authenticate();
      console.log("Database connection established.");
      return;
    } catch (error) {
      console.log(
        `Database not ready (attempt ${i}/${maxRetries}), retrying in ${delayMs / 1000}s...`
      );
      if (i === maxRetries) {
        console.error("Unable to connect to database after retries:", error);
        process.exit(1);
      }
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

await connectWithRetry();

// User model (replaces old Player model)
export const User = sequelizeInstance.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(32),
    unique: true,
    allowNull: false,
  },
  pinHash: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  balance: {
    type: DataTypes.BIGINT,
    defaultValue: 1000,
  },
});

await User.sync();
console.log("User table synced.");

// --- Pin hashing ---
export function hashPin(pin) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(pin.toString(), salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPin(pin, stored) {
  const [salt, hash] = stored.split(":");
  const testHash = crypto.scryptSync(pin.toString(), salt, 64).toString("hex");
  return hash === testHash;
}

// --- Helpers for tableManager ---
export async function getUserById(userId) {
  return await User.findOne({ where: { id: userId } });
}

export async function updateBalance(userId, newBalance) {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) return null;
  if (newBalance !== null && newBalance !== undefined) {
    user.balance = newBalance;
    await user.save();
  }
  return user;
}

// --- Express + Socket.io ---
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  next();
});

import authRoutes from "./routes/api.js";
app.use("/api", authRoutes);

setupSocketHandlers(io, getUserById, updateBalance);

const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
  console.log("Server listening on port " + port);
});
