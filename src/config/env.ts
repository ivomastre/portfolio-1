import "dotenv/config";

declare let process: {
  env: {
    NODE_ENV: "production" | "dev" | "test";
    PORT: number;
    DB_TYPE: "mysql" | "postgres" | "oracle" | "mongodb";
    DB_URL?: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_LOGS: boolean;
    JWT_SECRET: string;
    JWT_EXPIRES_IN?: string;
  };
};

export const {
  NODE_ENV = "dev",
  PORT = 4000,
  DB_TYPE = "mysql",
  DB_URL,
  DB_HOST = "localhost",
  DB_PORT = 3306,
  DB_USERNAME = "root",
  DB_PASSWORD = "secret",
  DB_NAME = "test",
  DB_LOGS = true,
  JWT_SECRET = 'secret',
  JWT_EXPIRES_IN,
} = process.env;
