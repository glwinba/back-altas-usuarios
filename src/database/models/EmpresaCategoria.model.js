import { DataTypes } from "sequelize";
import { sequelizeBMServEsp as sequelize } from "../connection.js";
 
const EmpresaCategoria = sequelize.define("EmpresaCategoria", {
    Uuid: {
        type: DataTypes.STRING
    },
    HabilitadoCategoriaMaterialidad: {
        type: DataTypes.INTEGER
    },
    EmpresaId: {
        type: DataTypes.INTEGER
    },
    CategoriaMaterialidadId: {
        type: DataTypes.INTEGER
    }
});

export default EmpresaCategoria