import { DataTypes } from "sequelize";
import { sequelizeBMServEsp as sequelize } from "../connection.js";

const CategoriaOperador = sequelize.define("CategoriaOperador", {
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

export default CategoriaOperador