import express from 'express';
import config from './config/config';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import mongoose from 'mongoose';
import session from 'express-session';
import mongoDbStore from 'connect-mongo';

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

    // Routes
    app.use('/', (req, res) => {
        res.send('Hello, World!');
    });
    app.use(errorHandler);

    app.listen(config.port, () => {
        console.log(`Server is running on port ${config.port}`);
    });
})();