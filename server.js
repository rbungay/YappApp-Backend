import db from "./db/connection.js";
import express from "express";
import logger from "morgan";
import chalk from "chalk";
import cors from "cors";
import usersRouter from "./routes/users.js";
import profilesRouter from "./routes/profiles.js";
import postsRouter from "./routes/posts.js";
import commentsRouter from "./routes/comments.js";
import authsRouter from "./routes/auths.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (profile, done) => {
      const user = { id: profile.id, email: profile.emails[0].value };
      return done(null, user);
    }
  )
);

app.use(passport.initialize());
app.use(cors());
app.use(express.json());
app.use(logger("dev"));

app.use("/users", usersRouter);
app.use("/profiles", profilesRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/auth", authsRouter);

db.on("connected", () => {
  console.clear();
  console.log(chalk.blue("Connected to MongoDB!"));

  app.listen(PORT, () => {
    console.log(`Express server running on port: ${PORT}`);
  });
});
