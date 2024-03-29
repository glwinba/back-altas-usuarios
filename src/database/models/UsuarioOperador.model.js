import { DataTypes } from "sequelize";
import { sequelizeBMServEsp as sequelize } from "../connection.js";

const UsuarioOperador = sequelize.define("UsuarioOperador", {
    EmpresaId: {
        type: DataTypes.INTEGER
    },
    Rfc: {
        type: DataTypes.STRING
    }, 
    ModuloTipoUsuarioId: {
        type: DataTypes.INTEGER
    }
});

export default UsuarioOperador