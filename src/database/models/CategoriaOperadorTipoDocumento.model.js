import { DataTypes } from "sequelize";
import { sequelizeBMServEsp as sequelize } from "../connection.js";

const CategoriaOperadorTipoDocumento = sequelize.define("CategoriaOperadorTipoDocumento", {
    Uuid: {
        type: DataTypes.STRING
    },
    RequireValidacion: {
        type: DataTypes.INTEGER
    },
    HabilitadoDocumento: {
        type: DataTypes.INTEGER
    },
    CategoriaOperadorId: {
        type: DataTypes.INTEGER
    },
    CatalogoTipoDocumentoId: {
        type: DataTypes.INTEGER
    }

});

export default CategoriaOperadorTipoDocumento