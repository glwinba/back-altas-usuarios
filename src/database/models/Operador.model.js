import { DataTypes } from "sequelize";
import { sequelizeBMServEsp as sequelize } from "../connection.js";

const Operador = sequelize.define("Operador", {
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
    }, 
    AreaServicio: {
        type: DataTypes.STRING
    }
});

export default Operador