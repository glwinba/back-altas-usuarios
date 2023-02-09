import { DataTypes } from "sequelize";
import { sequelizeBMServEsp as sequelize } from "../connection.js";

const UsuariosRoles = sequelize.define("UsuariosRoles", {
    Activo: {
        type: DataTypes.INTEGER
    },
    Especial: {
        type: DataTypes.STRING
    },
    UsuarioNombreUsuario: {
        type: DataTypes.STRING
    },
    RoleId: {
        type: DataTypes.INTEGER
    }
});

export default UsuariosRoles