import { Router, Request, Response } from "express";
import { login, register } from "../controller/userController";

const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;
