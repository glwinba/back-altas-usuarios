import config from "../config.js";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    config.DB_NAME_SCHEMA,
    config.DB_NAME_USER,
    config.DB_PASSWORD, 
    {
        host: config.DB_SERVER,
        port: config.DB_PORT,
        dialect: "mssql",
        timezone: "America/Mexico_City",
        define: {
            schema: "dbo",
            freezeTableName: true // Tablas en singular
        },
    }
);

export default sequelize

