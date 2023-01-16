var { config } = require('dotenv');

config();

export default {
    PORT: process.env.PORT || 5000,
    IDUSER: process.env.IDUSER,
    DB_NAME: process.env.DB_NAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_SERVER: process.env.DB_SERVER
}