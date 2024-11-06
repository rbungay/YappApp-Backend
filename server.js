import db from "./db/connection.js";
import express from "express";
import logger from "morgan";
import chalk from "chalk";
import cors from "cors";
import usersRouter from "./routes/users.js";
import profilesRouter from "./routes/profiles.js";
import postsRouter from "./routes/posts.js";
import commentsRouter from "./routes/comments.js";
import promptsRouter from "./routes/prompts.js";
import authsRouter from "./routes/auths.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import User from "./models/user.js";
import "./instrument.js";

import * as Sentry from "@sentry/node";

import dotenv from "dotenv";
dotenv.config();

//Websocket implementation
import http from "http";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);
export { io };

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create the user in your database
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // If user doesn't exist, create a new one
          user = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            username:
              profile.displayName || profile.emails[0].value.split("@")[0],
          });
          await user.save();
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1h", // Token expiration time
        });

        return done(null, token);
      } catch (error) {
        console.error("Error during user authentication:", error);
        return done(error, null);
      }
    }
  )
);

app.use(passport.initialize());
app.use(
  cors({
    origin: "https://yappapp.netlify.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(logger("dev"));

app.use("/users", usersRouter);
app.use("/profiles", profilesRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/auth", authsRouter);
app.use("/prompts", promptsRouter);
app.use("/api/users", profilesRouter);

app.get("/", function rootHandler(req, res) {
  res.end("Hello world!");
});

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

db.on("connected", () => {
  console.clear();
  console.log(chalk.blue("Connected to MongoDB!"));

  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  server.listen(PORT, () => {
    console.log(`Express server running on port: ${PORT}`);
  });
});
