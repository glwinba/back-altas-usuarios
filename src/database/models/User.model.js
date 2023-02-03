import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";

const User = sequelize.define("USUARIO", {
    UUID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    NOMBREUSUARIO: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo USUARIO es requerido."
            },
        }
    },
    PASS: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo CONTRASEÑA es requerido."
            },
        }
    },
    IDROL: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    NOMBRE: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo NOMBRE EMPRESA es requerido."
            }
        }
    },
    EMAIL: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: {
                args: true,
                msg: "Ingresa un correo electronico valido."
            }
        }
    }, 
    HABILITADO: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});


export default User