declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production" | "test";
            SERVER_PORT: string;
            MONGO_USERNAME: string;
            MONGO_PASSWORD: string;
            SERVICE_ACCOUNT_KEY: string;
            FIREBASE_API_KEY: string;
            FIREBASE_AUTH_DOMAIN: string;
            FIREBASE_PROJECT_ID: string;
            FIREBASE_STORAGE_BUCKET: string;
            FIREBASE_MESSAGING_SENDER_ID: string;
            FIREBASE_APP_ID: string;
            FIREBASE_MEASUREMENT_ID: string;
            FIREBASE_REFRESH_API_KEY: string;
            UNSPLASH_ACCESS_KEY: string;
        }
    }
}

export {};
