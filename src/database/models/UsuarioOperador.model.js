import { DataTypes } from "sequelize";
import { sequelizeBMServEsp as sequelize } from "../connection.js";

const UsuarioOperador = sequelize.define("UsuarioOperador", {
    EmpresaId: {
        type: DataTypes.STRING
    },
    Rfc: {
        type: DataTypes.STRING
    }
});

export default UsuarioOperador