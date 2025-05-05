import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
    status?: number;
    code?: string;
    details?: any;
}

// Custom error class
export class CustomError implements Partial<AppError> {
    name: string;
    constructor(
        public message: string,
        public status: number = 500,
        public code?: string,
        public details?: any
    ) {
        this.name = 'CustomError';
    }
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Log error details
    console.error({
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
        error: {
            name: err.name,
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
            code: (err as CustomError).code,
            details: (err as CustomError).details
        }
    });

    // Detailed error responses for development
    const isProduction = process.env.NODE_ENV === 'production';

    const response = {
        success: false,
        message: err.message || 'Internal Server Error',
        ...(isProduction ? {} : {
            code: (err as CustomError).code,
            details: (err as CustomError).details,
            stack: err.stack
        })
    };

    res.status(err.status ?? 500).json(response);
};
