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

export async function getChores(req: Request, res: Response, next: NextFunction) {
    try {
        // @ts-ignore
        const { familyId } = req.params;

        // Now get the latest chore week for the family by sorting by week
        const choreWeek = await ChoreWeek.find({ family: familyId }).sort({ weekStart: 'descending' }).limit(1);
        // No chore week means that there are no chores for the family
        if (choreWeek.length === 0) {
            throw new CustomError("No chore week found for this family", 404, 'NO_CHORE_WEEK');
        }
        // Get all the chores for the latest chore week
        const choresByWeek = await Chore.find({ choreWeek: choreWeek[0]._id }).populate('assignees');
        res.status(200).json({
            success: true,
            message: "Chores fetched successfully",
            data: {
                chores: choresByWeek,
                choreWeek: choreWeek[0]
            }
        });
    } catch (error) {
        next(error);
    }
}

export async function updateChore(req: Request, res: Response, next: NextFunction) {
    try {
        // @ts-ignore
        if (!req.user?.isAdmin) {
            throw new CustomError("Only admins can update chores", 403, "FORBIDDEN");
        }
        const { choreId } = req.params;
        const updateData = req.body as Partial<IChore>;

        const updatedChore = await Chore.findByIdAndUpdate(choreId, updateData, { new: true }).populate('assignees');
        if (!updatedChore) {
            throw new CustomError("Chore not found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Chore updated successfully",
            data: updatedChore
        });
    } catch (error) {
        next(error);
    }
}

export async function updateChoreWeek(req: Request, res: Response, next: NextFunction) {
    try {
        const { choreWeekId } = req.params;
        const { prizeName } = req.body;

        const updatedChoreWeek = await ChoreWeek.findByIdAndUpdate(choreWeekId, { weekPrize: prizeName });
        if (!updatedChoreWeek) {
            throw new CustomError("Chore week not found", 401);
        }

        res.status(200).json({
            success: true,
            message: "Chore week successfully updated",
            data: updatedChoreWeek
        })

    } catch (error) {
        next(error);
    }
}