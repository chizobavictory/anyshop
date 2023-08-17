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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../models/user"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const secretKey = process.env.SECRET_KEY || "";
const jwtkey = process.env.JWT_KEY || "";
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
        const userEmail = yield user_1.default.findOne({ email: req.body.email });
        if (userEmail) {
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
// Login
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({
            message: "Please input your username and password",
        });
        return;
    }
    try {
        const user = yield user_1.default.findOne({ username: req.body.username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Decrypt the stored password and compare with the provided password
        const decryptedStoredPassword = crypto_js_1.default.AES.decrypt(user.password, secretKey).toString(crypto_js_1.default.enc.Utf8);
        if (decryptedStoredPassword !== req.body.password) {
            return res.status(401).json({ message: "Invalid password" });
        }
        // Generate JWT token
        const accessToken = jsonwebtoken_1.default.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, jwtkey, { expiresIn: "3d" });
        // Remove password from the user object and send response
        const _a = user.toObject(), { password } = _a, others = __rest(_a, ["password"]);
        res.status(200).json(Object.assign(Object.assign({}, others), { accessToken }));
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
exports.default = router;
