import { config } from "dotenv";
config();

export default {
    PORT: process.env.PORT || 5000,
    DB_NAME_USER: process.env.DB_NAME_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,
    DB_NAME_SCHEMA: process.env.DB_NAME_SCHEMA,
    DB_SERVER: process.env.DB_SERVER
}