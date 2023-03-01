import { DataTypes } from "sequelize";
import { sequelizeBMServEspClientes as sequelize } from "../connection.js";

const AccesosClientes = sequelize.define("Accesos", {
    UsuariosRoleId: {
        type: DataTypes.INTEGER
    },
    PermisoId: {
        type: DataTypes.INTEGER
    },
    Activo: {
        type: DataTypes.INTEGER
    }
});

export default AccesosClientes