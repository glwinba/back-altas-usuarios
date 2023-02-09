import { DataTypes } from "sequelize";
import { sequelizeGeneral as sequelize } from "../connection.js";

const EmpresaUsuariosModulo = sequelize.define('EmpresaUsuarioModulo', {
    EmpresaId: { 
        type: DataTypes.INTEGER
    },
    UsuarioNombreUsuario: {
        type: DataTypes.STRING
    }, 
    CatalogoModuloId: {
        type: DataTypes.INTEGER
    }
});

export default EmpresaUsuariosModulo