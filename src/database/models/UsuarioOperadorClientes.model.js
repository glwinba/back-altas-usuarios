import { DataTypes } from "sequelize";
import { sequelizeBMServEspClientes as sequelize } from "../connection.js";

const UsuarioOperadorClientes = sequelize.define("UsuarioOperador", {
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

export default UsuarioOperadorClientes