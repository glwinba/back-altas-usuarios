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
    GrupoId: {
        type: DataTypes.INTEGER
    }
});

export default Empresa