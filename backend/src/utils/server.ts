import express from 'express';
import config from '../config/config';
import morgan from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';
import mongoDbStore from 'connect-mongo';
import passport from 'passport';
import { CustomError, errorHandler } from '../middleware/errorHandler';
import { Strategy as LocalStrategy } from 'passport-local';
import { IUser, User } from '../models/user.model';
import { API_PREFIX } from './constants';

export const app = express();

export async function setupServer() {
    try {
        try {
            await mongoose.connect(config.dbUrl);
            console.log('Database connected successfully');
        } catch (error) {
            console.error('Database connection failed:', error);
            // Exit the process if database connection fails
            process.exit(1);
        }

        const sessionStore = mongoDbStore.create({
            mongoUrl: config.dbUrl,
            touchAfter: 24 * 3600,
            autoRemove: "native",
        });

        const sessionOptions: session.SessionOptions = {
            secret: config.cookieSecret,
            store: sessionStore,
            name: 's_id',
            resave: false,
            saveUninitialized: false,
            rolling: true,
            cookie: {
                // Cookie expires after 8 hours
                maxAge: 1000 * 3600 * 8,
                httpOnly: config.nodeEnv === 'production',
                secure: config.nodeEnv === 'production',
            }
        };


        // Middleware
        app.use(morgan('dev'));
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(session(sessionOptions));

        // Auth configuration
        passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, User.authenticate()));
        // @ts-ignore
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());
        app.use(passport.initialize());
        app.use(passport.session());

        // Routes
        app.get('/', (req, res) => {
            res.send('Hello, World!');
        });

        // Login route
        app.post(`${API_PREFIX}/auth/login`, (req, res, next) => {
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
        });

        // Register route
        app.post(`${API_PREFIX}/auth/register`, async (req, res, next) => {
            try {
                const { email, password } = req.body;

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

                const user = new User({ email });
                const registeredUser = await User.register(user, password);

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
        });

        // Logout route
        app.post(`${API_PREFIX}/auth/logout`, (req, res, next) => {
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
        });

        app.use(errorHandler);
    } catch (error) {
        console.error('Error setting up the server:', error);
    }
}