import { Router } from "express";
import UserModel from "../models/user";
import CryptoJS from "crypto-js";

const router = Router();
const secretKey = process.env.SECRET_KEY || "";

// Register
router.post("/register", async (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    res.status(400).json({
      message: "Please input your username, email, and password",
    });
    return;
  }

  try {
    // Check if the email already exists in the database
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Encrypt the password before saving
    const encryptedPassword = CryptoJS.AES.encrypt(req.body.password, secretKey).toString();

    const newUser = new UserModel({
      username: req.body.username,
      email: req.body.email,
      password: encryptedPassword,
    });

    // Save the new user
    const savedUser = await newUser.save();
    res.status(200).json(savedUser); // Send the saved user as a response
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({
      message: "Please input your username and password",
    });
    return;
  }

  try {
    const existingUser = await UserModel.findOne({ username: req.body.username });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Decrypt the stored password and compare with the provided password
    const decryptedStoredPassword = CryptoJS.AES.decrypt(existingUser.password, secretKey).toString(CryptoJS.enc.Utf8);
    if (decryptedStoredPassword !== req.body.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // If everything checks out, send a success response
    res.status(200).json({ message: "Login successful", user: existingUser });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
