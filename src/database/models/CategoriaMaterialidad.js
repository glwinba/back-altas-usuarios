import { DataTypes } from "sequelize";
import { sequelizeBMServEsp as sequelize } from "../connection.js";

const CategoriaMaterialidad = sequelize.define("CategoriaMaterialidad", {
    Uuid: { 
        type: DataTypes.STRING
    },
    Nombre: {
        type: DataTypes.STRING
    }
});

export default CategoriaMaterialidad