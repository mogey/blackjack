import express from "express";
import dotenv from "dotenv";
import routes from "./routes/api.js";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

const port = process.env.port || 5000;

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
