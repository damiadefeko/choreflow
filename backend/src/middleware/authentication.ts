import { NextFunction, Request, Response } from "express";
import { CustomError } from "./errorHandler";

/**
 * Middleware to check if the user is authenticated.
*/
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next();
    }
    throw new CustomError('User not authenticated', 401, 'UNAUTHORIZED');
}