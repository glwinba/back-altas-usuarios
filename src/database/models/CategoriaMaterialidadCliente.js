import { DataTypes } from "sequelize";
import { sequelizeBMServEspClientes as sequelize } from "../connection.js";

const CategoriaMaterialidadCliente = sequelize.define("CategoriaMaterialidadCliente", {
    Uuid: { 
        type: DataTypes.STRING
    },
    Nombre: {
        type: DataTypes.STRING
    }
});

export default CategoriaMaterialidadCliente