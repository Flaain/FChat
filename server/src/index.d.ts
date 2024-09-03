namespace NodeJS {
    type NODE_ENV = 'dev' | 'production';
    interface ProcessEnv {
        NODE_ENV: NODE_ENV;
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
        STORAGE_ENDPOINT: string;
        STORAGE_REGION: string;
        BUCKET_NAME: string;
        BUCKET_KEY_ID: string;
        BUCKET_SECRET: string;
    }
}

interface ENV extends NodeJS.ProcessEnv {
    [key: string]: string;
}