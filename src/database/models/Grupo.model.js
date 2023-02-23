import { DataTypes } from "sequelize";
import { sequelizeGeneral as sequelize } from "../connection.js";

const Grupo = sequelize.define("Grupo", {
    uuid: { 
        type: DataTypes.STRING
    },
    nombre: {
        type: DataTypes.STRING
    }, 
    codigo: {
        type: DataTypes.STRING
    },
    habilitado: {
        type: DataTypes.INTEGER
    },
    activo: {
        type: DataTypes.INTEGER
    },
    comentarios: {
        type: DataTypes.STRING
    }
    
});

export default Grupo