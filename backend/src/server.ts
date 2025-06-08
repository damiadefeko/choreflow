import express from 'express';
import config from './config/config';
import morgan from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';
import mongoDbStore from 'connect-mongo';
import passport from 'passport';
import { CustomError, errorHandler } from './middleware/errorHandler';
import { Strategy as LocalStrategy } from 'passport-local';
import { IUser, User } from './models/user.model';
import { API_PREFIX } from './utils/constants';

(async () => {
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

    const app = express();

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

    app.post(`${API_PREFIX}/auth/login`, (req, res, next) => {
        passport.authenticate('local', (err: Error, user: IUser, info: { message: string }) => {
            console.log("HERE");
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

    app.use(errorHandler);

    app.listen(config.port, () => {
        console.log(`Server is running on port ${config.port}`);
    });
})();