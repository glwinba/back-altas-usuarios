import { DataTypes } from "sequelize";
import { sequelizeBMServEspClientes as sequelize } from "../connection.js";


const OperadorCliente = sequelize.define("Operador", {
    Uuid: {
        type: DataTypes.STRING
    },
    RazonSocial: {
        type: DataTypes.STRING
    },
    Rfc:{ 
        type: DataTypes.STRING
    },
    EmpresaId: {
        type: DataTypes.INTEGER
    },
    CatalogoOperadorId: {
        type: DataTypes.INTEGER
    }
});

export default OperadorCliente