import sql from "mssql";
import config from "../config.js";
// const dbSettings = {
//     user: process.env.DB_NAME_USER,
//     password: process.env.DB_PASSWORD,
//     server: process.env.DB_SERVER,
//     database: process.env.DB_NAME_SCHEMA,
//     port: process.env.DB_PORT,
//     options: {
//         encrypt: true,
//         trustServerCertificate: true
//     }
// }

const dbSettings = {
    user: config.DB_NAME_USER,
    password: config.DB_PASSWORD,
    server: config.DB_SERVER,
    database: config.DB_NAME_SCHEMA,
    port: parseInt(config.DB_PORT),
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

export async function getConnection(){
    try {
        const pool = await sql.connect(dbSettings);
        return pool
    } catch (e) {
        console.log(e);
    }
}

export { sql }