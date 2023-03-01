import { DataTypes } from "sequelize";
import { sequelizeBMServEspClientes as sequelize } from "../connection.js";

const OperadorPeriodoCliente = sequelize.define("OperadorPeriodo", {
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

export default OperadorPeriodoCliente