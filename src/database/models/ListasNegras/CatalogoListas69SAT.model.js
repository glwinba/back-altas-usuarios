import { DataTypes } from "sequelize";
import { sequelizeListasNegras as sequelize } from "../../connection.js";

const CatalogoListas69SAT = sequelize.define("CatalogoLista69SAT", {
    nombreSupuesto: {
        type: DataTypes.STRING
    },
    url: {
        type: DataTypes.STRING
    },
    enable: {
        type: DataTypes.INTEGER
    },
})

export default CatalogoListas69SAT