import { DataTypes } from "sequelize";
import { sequelizeBMServEsp as sequelize } from "../connection.js";

const OperadorPeriodo = sequelize.define("OperadorPeriodo", {
    UUID: {
        type: DataTypes.STRING
    },
    Mes: {
        type: DataTypes.INTEGER
    },
    Ano: {
        type: DataTypes.INTEGER
    },
    Activo: {
        type: DataTypes.INTEGER
    },
    CargaMaterialidad: {
        type: DataTypes.INTEGER
    },
    OperadorId: {
        type: DataTypes.INTEGER
    }
});

export default OperadorPeriodo