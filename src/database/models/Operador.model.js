import { DataTypes } from "sequelize";
import { sequelizeBMServEsp as sequelize } from "../connection.js";

const Operador = sequelize.define("Operador", {
    Rfc:{ 
        type: DataTypes.STRING
    }, 
    EmpresaId: {
        type: DataTypes.INTEGER
    }
});

export default Operador