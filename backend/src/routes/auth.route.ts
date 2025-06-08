import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.route("/login").post(login);
authRouter.route("/register").post(register);
authRouter.route("/logout").post(logout);