import { Request, Response, NextFunction } from 'express';
import { CustomError, errorHandler } from '../../src/middleware/errorHandler';

describe('Error Handler Middleware', () => {
    // Mock object declarations
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        mockRequest = {
            path: '/test',
            method: 'GET'
        };

        mockResponse = {
            // Use mockReturnThis to allow method chaining
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        nextFunction = jest.fn();

        // Spy on console.error and mock its implementation to prevent actual logging
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        process.env.NODE_ENV = 'development';
    });

    it('should handle CustomError correctly in development mode', () => {
        const error = new CustomError(
            'Test 404 error',
            404,
            'TEST_ERROR',
            { additional: 'resource not found' }
        );

        errorHandler(
            error,
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            message: 'Test 404 error',
            code: 'TEST_ERROR',
            details: { additional: 'resource not found' },
            stack: undefined
        });
    });

    it('should handle CustomError correctly in production mode', () => {
        process.env.NODE_ENV = 'production';

        const error = new CustomError(
            'Test error',
            400,
            'TEST_ERROR',
            { additional: 'details' }
        );

        errorHandler(
            error,
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        // In production, we ecpect less detail in the response
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            message: 'Test error'
        });
    });

    it('should log error details', () => {
        const error = new CustomError('Test error');

        errorHandler(
            error,
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                timestamp: expect.any(String),
                path: '/test',
                method: 'GET',
                error: expect.objectContaining({
                    name: 'CustomError',
                    message: 'Test error'
                })
            })
        );
    });
});