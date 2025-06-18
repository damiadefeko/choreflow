import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../middleware/errorHandler";
import { IUser, User } from "../models/user.model";
import { Family } from "../models/family.model";
import { FamilyMember } from "../models/family-member.model";
import { generateInviteId } from "../utils/helper";

export function login(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', (err: Error, user: IUser, info: { message: string }) => {
        // Pass errors to error handler
        if (err) {
            return next(err);
        }

        if (!user) {
            // If user is not found or authentication fails, throw a custom error
            return next(new CustomError(
                info.message || 'Authentication failed',
                401,
                'AUTH_ERROR',
            ));
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }

            return res.status(200).json({
                success: true,
                user: {
                    id: user._id,
                    email: user.email,
                    isAdmin: user.isAdmin
                }
            });
        });
    })(req, res, next);
}

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password, isAdmin, inviteId } = req.body;

        // Ensure email and password are not empty
        if (!email || !password) {
            return next(new CustomError(
                'Email and password must not be empty',
                400,
                'VALIDATION_ERROR',
            ));
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new CustomError(
                'Email already registered',
                409,
                'EMAIL_EXISTS'
            );
        }

        const user = new User({ email, isAdmin });
        const registeredUser = await User.register(user, password);

        // When a user registers as an admin, create a new family
        if (isAdmin) {
            const newFamily = new Family({ admin: user, inviteId: generateInviteId() });
            await newFamily.save();
        } else {
            // If the user is not an admin, check if an inviteId is provided
            // This means they have been invited to an existing family
            const existingFamily = await Family.findOne({ inviteId });
            if (existingFamily) {
                // If family exists, add the user as a family member
                const familyMember = new FamilyMember({ user, family: existingFamily });
                await familyMember.save();
                // Push the new family member to the existing family's members
                existingFamily.familyMembers.push(familyMember);
                await existingFamily.save();
            } else {
                // In this case the user was not invited to any family
                const familyMember = new FamilyMember({ user });
                await familyMember.save();
            }
        }

        req.logIn(registeredUser, (err) => {
            if (err) {
                return next(new CustomError(
                    'Registration successful but login failed',
                    500,
                    'AUTO_LOGIN_FAILED'
                ));
            }

            return res.status(201).json({
                success: true,
                user: {
                    id: registeredUser._id,
                    email: registeredUser.email,
                    isAdmin: registeredUser.isAdmin
                }
            });
        });
    } catch (error) {
        return next(error);
    }
}

export function logout(req: Request, res: Response, next: NextFunction) {
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
        return next(new CustomError(
            'No active session',
            401,
            'NO_SESSION'
        ));
    }

    req.logout((err) => {
        if (err) {
            return next(new CustomError(
                'Logout failed',
                500,
                'LOGOUT_ERROR',
                { error: err.message }
            ));
        }

        // Destroy the session after logout
        req.session.destroy((err) => {
            if (err) {
                return next(new CustomError(
                    'Session cleanup failed',
                    500,
                    'SESSION_ERROR',
                    { error: err.message }
                ));
            }

            res.clearCookie('s_id');
            return res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });
        });
    });
}

export function isSessionActive(req: Request, res: Response, next: NextFunction) {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
        res.status(200).json({
            success: true,
            user: {
                // @ts-ignore
                id: req.user._id,
                // @ts-ignore
                email: req.user.email,
                // @ts-ignore
                isAdmin: req.user.isAdmin
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'No active session'
        });
    }
}