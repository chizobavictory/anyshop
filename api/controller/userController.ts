import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";


// Register
export const register = async (req: Request, res: Response) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    res.status(400).json({
      message: "Please input your username, email, and password",
    });
    return;
  }
  try {
    const userEmail = await User.findOne({ email: req.body.email });
    if (userEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const encryptedPassword = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY || "").toString();

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: encryptedPassword,
    });

    const savedUser = await newUser.save();
    res.status(200).json(savedUser); // Send the saved user as a response
  } catch (err) {
    res.status(500).json(err);
  }
};

//Login
export const login = async (req: Request, res: Response) => {
  try {
    const user: IUser | null = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(401).json("User does not exist");
    }

    const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC || "");
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== req.body.password) {
      return res.status(401).json("Wrong password credentials");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_KEY || "",
      { expiresIn: "3d" }
    );
    
    const { password, ...others } = user.toObject();

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
