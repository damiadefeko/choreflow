import { NextFunction, Request, Response } from "express";
import { Chore, IChore } from "../models/chore.model";
import { ChoreWeek, IChoreWeek } from "../models/chore-week.model";
import { CustomError } from "../middleware/errorHandler";

export async function createChore(req: Request, res: Response, next: NextFunction) {
    try {
        // @ts-ignore
        if (!req.user?.isAdmin) {
            throw new CustomError("Only admins can create chores", 403, "FORBIDDEN");
        }
        let finalChoreWeek: IChoreWeek;
        const { choreName, choreDescription, chorePoints, choreDeadline, assignees } = req.body as IChore;
        const { familyId } = req.params;
        // Get latest chore week for the family
        const choreWeek = await ChoreWeek.find({ family: familyId }).sort({ weekStart: 'descending' }).limit(1);
        // Check if this is the first ever chore week
        if (!choreWeek || choreWeek.length === 0) {
            // Calculate the first day of the week (Monday)
            const today = new Date();
            const firstDayOfWeek = new Date(today);
            firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1);
            // Create new chore week
            const newChoreWeek = await ChoreWeek.create({
                family: familyId,
                weekStart: firstDayOfWeek,
            });
            newChoreWeek.save();
            finalChoreWeek = newChoreWeek;
        } else {
            // Calculate end of the week date
            const weekEndDate = new Date(choreWeek[0].weekStart);
            weekEndDate.setDate(weekEndDate.getDate() + 6);

            const today = new Date();
            // Check if today is past the previous chore week end date
            if (today > weekEndDate) {
                // Calculate the first day of the week (Monday)
                const firstDayOfWeek = new Date(today);
                firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1);
                // Create new chore week
                const newChoreWeek = await ChoreWeek.create({
                    family: familyId,
                    weekStart: firstDayOfWeek,
                });
                newChoreWeek.save();
                finalChoreWeek = newChoreWeek;
            } else {
                // Use the existing chore week
                finalChoreWeek = choreWeek[0];
            }
        }

        const newChore = new Chore({ choreName, choreDescription, chorePoints, choreDeadline, choreWeek: finalChoreWeek._id, assignees });
        const savedChore = await newChore.save();
        res.status(201).json({
            success: true,
            message: "Chore created successfully",
            data: savedChore
        });
    } catch (error) {
        next(error);
    }
}