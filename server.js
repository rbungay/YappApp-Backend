import db from "./db/connection.js";
import express from "express";
import logger from "morgan";
import chalk from "chalk";
import cors from "cors";
import usersRouter from "./routes/users.js";
import profilesRouter from "./routes/profiles.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(logger("dev"));

app.use("/users", usersRouter);
app.use("/profile", profilesRouter);

db.on("connected", () => {
  console.clear();
  console.log(chalk.blue("Connected to MongoDB!"));

  app.listen(PORT, () => {
    console.log(`Express server running on port: ${PORT}`);
  });
});
