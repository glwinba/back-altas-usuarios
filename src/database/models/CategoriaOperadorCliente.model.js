import { DataTypes } from "sequelize";
import { sequelizeBMServEspClientes as sequelize } from "../connection.js";

const CategoriaOperadorCliente = sequelize.define("CategoriaOperador", {
    Uuid: {
        type: DataTypes.STRING
    },
    OperadorPeriodoId: {
        type: DataTypes.INTEGER
    },
    EmpresaCategoriumId: {
        type: DataTypes.INTEGER
    }
});

export default CategoriaOperadorCliente