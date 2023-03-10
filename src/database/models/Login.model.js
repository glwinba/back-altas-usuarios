import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";

const LoginUser = sequelize.define("LOGINUSERS", {
  NOMBREUSUARIO: {
    type: DataTypes.STRING,
  },
  NOMBRE: {
    type: DataTypes.STRING,
  },
  APELLIDOS: {
    type: DataTypes.STRING,
  },
  PASS: {
    type: DataTypes.STRING,
  },
  EMAIL: {
    type: DataTypes.STRING,
  },
});

export default LoginUser;
