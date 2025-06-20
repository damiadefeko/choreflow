import { NextFunction, Request, Response } from "express";
import { CustomError } from "../middleware/errorHandler";
import { FamilyMember } from "../models/family-member.model";
import { Family } from "../models/family.model";

export async function getFamily(req: Request, res: Response, next: NextFunction) {
    try {
        // @ts-ignore
        const userId = req.user?._id;
        // @ts-ignore
        const isAdmin = req.user?.isAdmin;

        if (isAdmin) {
            const family = await Family.findOne({ admin: userId }).populate({
                path: 'familyMembers',
                populate: {
                    path: 'user'
                }
            });
            res.status(200).json({
                success: true,
                family: family
            });
        } else {
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
        }
    } catch (error) {
        next(error);
    }
}

export async function getFamilyMember(req: Request, res: Response, next: NextFunction) {
    try {
        const { familyMemberId } = req.params;

        const familyMember = await FamilyMember.findById(familyMemberId).populate('user').populate('score');

        if (!familyMember) {
            throw new CustomError('Family member not found', 404, 'FAMILY_MEMBER_NOT_FOUND');
        }
        res.status(200).json({
            success: true,
            familyMember: {
                id: familyMember._id,
                user: {
                    id: familyMember.user._id,
                    email: familyMember.user.email,
                },
                score: familyMember.score,
            }
        });

    } catch (error) {
        next(error);
    }
}