import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const SALT_LENGTH = 12;
const JWT_EXPIRY = "24h";

const generateToken = (user) => {
  return jwt.sign(
    { username: user.username, _id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRY },
  );
};

const hashPassword = (password) => {
  return bcrypt.hashSync(password, SALT_LENGTH);
};

const verifyPassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

export const signUp = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        status: "error",
        message: "Username and password are required",
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        status: "error",
        message: "Username must be at least 3 characters long",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "Username already taken",
      });
    }

    const newUser = await User.create({
      username,
      hashedPassword: hashPassword(password),
    });

    const token = generateToken(newUser);

    // Return success response
    return res.status(201).json({
      status: "success",
      data: {
        user: {
          username: newUser.username,
          id: newUser._id,
        },
        token,
      },
    });
  } catch (error) {
    console.error("SignUp Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const signIn = async (req, res) => {
  try {
    // Input validation
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        status: "error",
        message: "Username and password are required",
      });
    }

    const user = await User.findOne({ username });

    // Check if user exists and password is correct
    if (!user || !verifyPassword(password, user.hashedPassword)) {
      return res.status(401).json({
        status: "error",
        message: "Invalid username or password",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      status: "success",
      data: {
        user: {
          username: user.username,
          id: user._id,
        },
        token,
      },
    });
  } catch (error) {
    console.error("SignIn Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
