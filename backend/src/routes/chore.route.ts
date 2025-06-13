import { Router } from "express";
import { isAuthenticated } from "../middleware/authentication";
import { createChore } from "../controllers/chore.controller";

export const choreRouter = Router();

choreRouter.use(isAuthenticated);

choreRouter.route("/:familyId").post(createChore);