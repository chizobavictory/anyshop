"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../models/user"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const router = (0, express_1.Router)();
const secretKey = process.env.SECRET_KEY || "";
// Register
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.username || !req.body.email || !req.body.password) {
        res.status(400).json({
            message: "Please input your username, email, and password",
        });
        return;
    }
    try {
        // Check if the email already exists in the database
        const existingUser = yield user_1.default.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }
        // Encrypt the password before saving
        const encryptedPassword = crypto_js_1.default.AES.encrypt(req.body.password, secretKey).toString();
        const newUser = new user_1.default({
            username: req.body.username,
            email: req.body.email,
            password: encryptedPassword,
        });
        // Save the new user
        const savedUser = yield newUser.save();
        res.status(200).json(savedUser); // Send the saved user as a response
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
// Login
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({
            message: "Please input your username and password",
        });
        return;
    }
    try {
        const existingUser = yield user_1.default.findOne({ username: req.body.username });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // Decrypt the stored password and compare with the provided password
        const decryptedStoredPassword = crypto_js_1.default.AES.decrypt(existingUser.password, secretKey).toString(crypto_js_1.default.enc.Utf8);
        if (decryptedStoredPassword !== req.body.password) {
            return res.status(401).json({ message: "Invalid password" });
        }
        // If everything checks out, send a success response
        res.status(200).json({ message: "Login successful", user: existingUser });
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
exports.default = router;
