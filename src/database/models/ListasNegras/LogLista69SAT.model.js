import { DataTypes } from "sequelize";
import { sequelizeListasNegras as sequelize } from "../../connection.js";

const LogLista69SAT = sequelize.define("LogLista69SAT", {
    hash: {
        type: DataTypes.TEXT
    },
    CatalogoLista69SATId: {
        type: DataTypes.INTEGER
    }
})

export default LogLista69SAT