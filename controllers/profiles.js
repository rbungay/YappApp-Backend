import express from "express";
import User from "../models/user.js"; // adjust the path as needed

const router = express.Router();

export const getUserProfile = async (req, res) => {
  try {
    if (req.user._id !== req.params.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("Profile not found.");
    }
    res.json({ user });
  } catch (error) {
    if (res.statusCode === 404) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export const updateUserName = async (req, res) => {
  try {
    if (req.user._id !== req.params.userId) {
      return res.status(401).json({ error: "Unathorized" });
    }

    const { newUsername } = req.body;

    //checker that newUsername exists
    const existingUser = await User.findOne({ username: newUsername });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username: newUsername },
      { new: true }
    );

    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    res.json({ message: "Username updated successfully", user });
  } catch (error) {
    if (res.statusCode === 404) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};
