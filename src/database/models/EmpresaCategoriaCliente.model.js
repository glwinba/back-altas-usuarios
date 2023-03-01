import { DataTypes } from "sequelize";
import { sequelizeBMServEspClientes as sequelize } from "../connection.js";
 
const EmpresaCategoriaCliente = sequelize.define("EmpresaCategoria", {
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

export default EmpresaCategoriaCliente