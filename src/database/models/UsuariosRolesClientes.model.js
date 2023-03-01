import { DataTypes } from "sequelize";
import { sequelizeBMServEspClientes as sequelize } from "../connection.js";

const UsuariosRolesClientes = sequelize.define("UsuariosRoles", {
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

export default UsuariosRolesClientes