import { DataTypes } from "sequelize";
import { sequelizeBMServEsp as sequelize } from "../connection.js";

const ModuloTipoUsuario = sequelize.define('ModuloTipoUsuario', {
    EmpresaUsuarioModuloId: {
        type: DataTypes.INTEGER
    }, 
    CatalogoTipoUsuarioId: {
        type: DataTypes.INTEGER
    }
});

export default ModuloTipoUsuario