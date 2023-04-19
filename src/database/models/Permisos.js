import { DataTypes } from "sequelize";
import { sequelizeBMServEsp as sequelize } from "../connection.js";

const Permisos = sequelize.define("Permisos", {
    Nombre: {
        type: DataTypes.STRING
    },
    Slug: {
        type: DataTypes.STRING
    },
    Descripcion: {
        type: DataTypes.STRING
    }
});

export default Permisos