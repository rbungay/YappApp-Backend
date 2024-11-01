import express from "express";
import User from "../models/user.js"; 
import bcrypt from "bcrypt";

const router = express.Router();

export const getUserProfile = async (req, res) => {
  try {
    if (req.user._id !== req.params.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await User.findById(req.user._id)
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

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() !== userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { username, email, currentPassword, newPassword, avatar } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found"});
    }

    const updates = {}

    const isGoogleUser = Boolean(user.googleId);

    if (!isGoogleUser && username && username !== user.username) {
      const existingUser = await User.findOne({ username, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ error: "Username is already taken" });
      }
      updates.username = username;
    }

    // Handle email update
    if (email && email !== user.email) {
      // Check if email is already taken
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ error: "Email is already taken" });
      }
      updates.email = email;
    }

    // Handle avatar update
    if (typeof avatar === 'number') {
      updates.avatar = avatar;
    }

    // Handle password update (for non Google users)
    if (!isGoogleUser && newPassword && currentPassword) {
      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.hashedPassword);
      if (!isValidPassword) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updates.password = hashedPassword;
    }

    // If no updates, return early
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No changes to save" });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true}
    ).select('-hashedPassword'); 
    

    // Send response
    res.json({ 
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        googleId: updatedUser.googleId
      } 
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

