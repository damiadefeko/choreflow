import express from 'express';
import config from './config/config';

const app = express();

app.use(express.json());

// Routes
app.use('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
}
);