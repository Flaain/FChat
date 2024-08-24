namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: string;
        PORT: string;
        MONGO_URI: string;
        DATABASE_USERNAME: string;
        DATABASE_PASSWORD: string;
        DATABASE_URI: string;
        ACCESS_TOKEN_SECRET: string;
        ACCESS_TOKEN_EXPIRESIN: string;
        REFRESH_TOKEN_SECRET: string;
        REFRESH_TOKEN_EXPIRESIN: string;
        CLIENT_URL: string;
        MAILER_USER: string;
        MAILER_PASS: string;
        MAILER_HOST: string;
    }
}

interface ENV {
    [key: string]: string;
    NODE_ENV: string;
    PORT: string;
    MONGO_URI: string;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;
    DATABASE_URI: string;
    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRESIN: string;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRESIN: string;
    CLIENT_URL: string;
    MAILER_USER: string;
    MAILER_PASS: string;
    MAILER_HOST: string;
}