import express from "express";
import dotenv from "dotenv";
dotenv.config();
import routes from "./routes/api.js";
import bodyParser from "body-parser";
import Sequelize from "sequelize";
import http from "http";
import { PlayerModel } from "./models/PlayerModel.js";
import { PlayerRouter } from "./routes/PlayerRoutes.js";
import { Server } from "socket.io";
import { registerLobbyHandlers } from "./Services/LobbyService.js";
const { DataTypes } = Sequelize;

//Initialize DB connection
export const sequelizeInstance = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER_ACCOUNT,
  process.env.MYSQL_USER_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    logging: () => {},
  }
);

//Check to make sure we connected
try {
  await sequelizeInstance.authenticate();
  console.log("Database connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

export const Player = PlayerModel(sequelizeInstance);

//Create the table for Player if it does not already exist
await Player.sync().then((response) => {
  console.log("Created database table for player");
});

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 5000;
const socketPort = process.env.SOCKPORT || parseInt(port) + 1;

server.listen(socketPort, () => {
  console.log("Started socket.io server listening on " + socketPort);
});

const io = new Server(server, { cors: { origin: "http://localhost:3000" } });

function registerEventHandlers(socket) {
  registerLobbyHandlers(io, socket);
}

io.on("connection", registerEventHandlers);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());

app.use("/api", PlayerRouter);

app.listen(port, () => {
  console.log("REST API is listening on port " + port);
});
