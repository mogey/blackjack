import express from "express";
import dotenv from "dotenv";
dotenv.config();
import routes from "./routes/api.js";
import bodyParser from "body-parser";
import Sequelize from "sequelize";
const { DataTypes } = Sequelize;

export const sequelizeInstance = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER_ACCOUNT,
  process.env.MYSQL_USER_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
  }
);

try {
  await sequelizeInstance.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

export const Player = sequelizeInstance.define("Player", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  money: {
    type: DataTypes.BIGINT,
    defaultValue: 1000,
  },
});

await Player.sync().then((response) => {
  console.log("Created database table for player");
});

const app = express();

const port = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());

app.use("/api", routes);

app.listen(port, () => {
  console.log("Listening on port " + port);
});
