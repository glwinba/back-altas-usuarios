import config from "../config.js";
import { Sequelize } from "sequelize";

// Schema dbo
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
            schema: "dbo", // Esquema de la base de datos.
            freezeTableName: true // Tablas en singular
        },
        logging: false
    }
);


const sequelizeBMServEsp = new Sequelize(
    config.DB_NAME_SCHEMA,
    config.DB_NAME_USER,
    config.DB_PASSWORD, 
    {
        host: config.DB_SERVER,
        port: config.DB_PORT,
        dialect: "mssql",
        timezone: "America/Mexico_City",
        define: {
            schema: "BM_SERV_ESP", // Esquema de la base de datos.
            freezeTableName: true // Tablas en singular
        },
        logging: false
    }
);

const sequelizeGeneral = new Sequelize(
    config.DB_NAME_SCHEMA,
    config.DB_NAME_USER,
    config.DB_PASSWORD, 
    {
        host: config.DB_SERVER,
        port: config.DB_PORT,
        dialect: "mssql",
        timezone: "America/Mexico_City",
        define: {
            schema: "GENERAL", // Esquema de la base de datos.
            freezeTableName: true // Tablas en singular
        },
        logging: false
    }
);

const sequelizeBMServEspClientes = new Sequelize(
    config.DB_NAME_SCHEMA,
    config.DB_NAME_USER,
    config.DB_PASSWORD, 
    {
        host: config.DB_SERVER,
        port: config.DB_PORT,
        dialect: "mssql",
        timezone: "America/Mexico_City",
        define: {
            schema: "BM_SERV_ESP_CLIENTES", // Esquema de la base de datos.
            freezeTableName: true // Tablas en singular
        },
        logging: false
    }
);

module.exports = {
    sequelize, sequelizeBMServEsp, sequelizeGeneral, sequelizeBMServEspClientes
}

