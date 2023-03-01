import { DataTypes } from "sequelize";
import { sequelizeBMServEspClientes as sequelize } from "../connection.js";

const ModuloTipoUsuarioClientes = sequelize.define('ModuloTipoUsuario', {
    EmpresaUsuarioModuloId: {
        type: DataTypes.INTEGER
    }, 
    CatalogoTipoUsuarioId: {
        type: DataTypes.INTEGER
    }
});

export default ModuloTipoUsuarioClientes