import { DataTypes } from "sequelize";
import { sequelizeGeneral as sequelize } from "../connection.js";

const EmpresaUsuariosModulo = sequelize.define('EmpresaUsuarioModulo', {
    EmpresaId: { 
        type: DataTypes.INTEGER
    },
    UsuarioNombreUsuario: {
        type: DataTypes.STRING
    }
});

export default EmpresaUsuariosModulo