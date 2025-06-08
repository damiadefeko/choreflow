import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    dbUrl: string;
    cookieSecret: string;
    dbTestUrl?: string;
}

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV ?? 'development',
    dbUrl: process.env.DATABASE_URL ?? '',
    cookieSecret: process.env.COOKIE_SECRET ?? 'my-cookie-secret',
    dbTestUrl: process.env.DATABASE_URL_TEST ?? '',
};

export default config;