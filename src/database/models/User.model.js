import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";

const User = sequelize.define("USUARIO", {
    PASS: {
        type: DataTypes.STRING,
        allowNull: false
    }
});


export default User