import { DataTypes } from "sequelize";
import { sequelizeBMServEsp as sequelize } from "../connection.js";

const Accesos = sequelize.define("Accesos", {
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

export default Accesos