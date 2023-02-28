import { DataTypes } from "sequelize";
import { sequelizeGeneral as sequelize } from "../connection.js";

const Empresa = sequelize.define('Empresa', {
    uuid: { 
        type: DataTypes.STRING
    },
    rfc: {
        type: DataTypes.STRING
    },
    nombre: {
        type: DataTypes.STRING
    }, 
    habilitado: {
        type: DataTypes.INTEGER
    },
    activo: {
        type: DataTypes.INTEGER
    },
    ciec: {
        type: DataTypes.STRING
    },
    comentarios: {
        type: DataTypes.TEXT
    },
    GrupoId: {
        type: DataTypes.INTEGER
    }
});

export default Empresa