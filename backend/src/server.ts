import express from 'express';
import config from './config/config';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import mongoose from 'mongoose';

(async () => {
    await mongoose.connect(config.dbUrl);

    const app = express();

    // Middleware
    app.use(morgan('dev'));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Routes
    app.use('/', (req, res) => {
        res.send('Hello, World!');
    });
    app.use(errorHandler);

    app.listen(config.port, () => {
        console.log(`Server is running on port ${config.port}`);
    });
})();