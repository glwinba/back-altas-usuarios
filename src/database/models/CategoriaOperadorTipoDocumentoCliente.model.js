import { DataTypes } from "sequelize";
import { sequelizeBMServEspClientes as sequelize } from "../connection.js";

const CategoriaOperadorTipoDocumentoCliente = sequelize.define("CategoriaOperadorTipoDocumento", {
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

export default CategoriaOperadorTipoDocumentoCliente