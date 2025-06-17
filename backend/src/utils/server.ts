import express from 'express';
import config from '../config/config';
import morgan from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';
import mongoDbStore from 'connect-mongo';
import passport from 'passport';
import { errorHandler } from '../middleware/errorHandler';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models/user.model';
import { API_PREFIX } from './constants';
import { authRouter } from '../routes/auth.route';
import { familyRouter } from '../routes/family.route';
import { choreRouter } from '../routes/chore.route';
import cors from 'cors';

export const app = express();

export async function setupServer(isTest: boolean = false) {
    try {
        try {
            await mongoose.connect(isTest ? config.dbTestUrl as string : config.dbUrl);
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
        app.use(cors({
            origin: 'http://localhost:5173',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

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

        app.use(`${API_PREFIX}/auth`, authRouter);
        app.use(`${API_PREFIX}/family`, familyRouter);
        app.use(`${API_PREFIX}/chores`, choreRouter);

        app.use(errorHandler);
    } catch (error) {
        console.error('Error setting up the server:', error);
    }
}