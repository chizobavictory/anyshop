import { Router } from "express";
import User from "../models/user";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

const router = Router();
const secretKey = process.env.SECRET_KEY || "";
const jwtkey = process.env.JWT_KEY || "";

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
    const userEmail = await User.findOne({ email: req.body.email });
    if (userEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Encrypt the password before saving
    const encryptedPassword = CryptoJS.AES.encrypt(req.body.password, secretKey).toString();

    const newUser = new User({
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

// Login
router.post("/login", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({
      message: "Please input your username and password",
    });
    return;
  }

  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Decrypt the stored password and compare with the provided password
    const decryptedStoredPassword = CryptoJS.AES.decrypt(user.password, secretKey).toString(CryptoJS.enc.Utf8);
    if (decryptedStoredPassword !== req.body.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      jwtkey,
      { expiresIn: "3d" }
    );

    // Remove password from the user object and send response
    const { password, ...others } = user.toObject();
    res.status(200).json({ ...others, accessToken });

  } catch (error) {
    res.status(500).json(error);
  }
});

export default router