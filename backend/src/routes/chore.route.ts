import { Router } from "express";
import { isAuthenticated } from "../middleware/authentication";
import { createChore, getChores, updateChore, updateChoreWeek } from "../controllers/chore.controller";

export const choreRouter = Router();

choreRouter.use(isAuthenticated);

choreRouter.route("/:familyId").post(createChore);
choreRouter.route("/:familyId").get(getChores);
choreRouter.route("/:choreId").put(updateChore);
choreRouter.route("/week/:choreWeekId").put(updateChoreWeek);