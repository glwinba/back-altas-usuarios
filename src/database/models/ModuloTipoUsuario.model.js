import { DataTypes } from "sequelize";
import { sequelizeBMServEsp as sequelize } from "../connection.js";

const ModuloTipoUsuario = sequelize.define('ModuloTipoUsuario', {
    EmpresaUsuarioModuloId: {
        type: DataTypes.STRING
    }
});

export default ModuloTipoUsuario