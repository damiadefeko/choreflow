import { NextFunction, Request, Response } from "express";
import { CustomError } from "../middleware/errorHandler";
import { FamilyMember } from "../models/family-member.model";

export async function getFamily(req: Request, res: Response, next: NextFunction) {
    try {
        // @ts-ignore
        const userId = req.user?._id;

        // Fetch the family associated with the user
        const familyMember = await FamilyMember.findOne({ user: userId }).populate({
            path: 'family',
            populate: {
                path: 'familyMembers',
                populate: {
                    path: 'user',
                }
            }
        });

        if (!familyMember) {
            throw new CustomError('Family member not found', 404, 'FAMILY_MEMBER_NOT_FOUND');
        }

        res.status(200).json({
            success: true,
            family: familyMember.family
        });
    } catch (error) {
        next(error);
    }
}