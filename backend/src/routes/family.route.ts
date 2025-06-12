import { Router } from "express";
import { isAuthenticated } from "../middleware/authentication";
import { getFamily } from "../controllers/family.controller";

export const familyRouter = Router();

// Make sure all requests made are with an authenticated user
familyRouter.use(isAuthenticated);

familyRouter.route("/member").get(getFamily);