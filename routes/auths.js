import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { OAuth2Client } from "google-auth-library"; // Import the Google Auth Library

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Initialize OAuth2Client

// Initiates Google authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Handles Google authentication callback
router.post("/google/callback", async (req, res) => {
  try {
    // Extract the token from the request body
    const { token } = req.body;

    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Specify the client ID
    });
    const payload = ticket.getPayload();

    // Check if user already exists
    let user = await User.findOne({ googleId: payload.sub });

    // If user does not exist, create a new user
    if (!user) {
      user = new User({
        googleId: payload.sub,
        email: payload.email,
        username: payload.name || payload.email.split("@")[0],
      });
      await user.save();
    }

    // Create a JWT token for your application
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Respond with the token
    res.json({ token: jwtToken, redirectUrl: "http://localhost:5173/landing" });
  } catch (error) {
    console.error("Error during authentication callback:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/"); // Redirect after logout
  });
});

export default router;
