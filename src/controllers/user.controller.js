import bcrypt from "bcrypt";
import { Op } from "sequelize";
import Operador from "../database/models/Operador.model.js";
import User from "../database/models/User.model.js";
import UsuarioOperador from "../database/models/UsuarioOperador.model.js";

// Hash password
const encryPassword = (password, rounds = 8) => {
    return bcrypt.hashSync(password, rounds);
}

export const changePassword = async (req, res) => {

    const password_hash = encryPassword(req.body.password);
    User.update({
        PASS: password_hash
    }, {
        where: {
            UUID: req.params.id
        }
    }).then((user) =>{
        res.json('Clave cambiada correctamente');
    })
}

export const updateRFCInternal = async (req, res) => {
    var operador = await Operador.findByPk(req.params.id, {
        attributes: ['id', 'Rfc', 'EmpresaId']
    });

    await Operador.update({
        Rfc: req.body.Rfc
    }, {
        where: {
            id: operador.id
        }
    }).then(result => {
        console.log(`Se actualizo ${result[0]} columna(s) de la tabla Operador`);
    });

    await UsuarioOperador.update({
        Rfc: req.body.Rfc
    }, {
        where: {
            EmpresaId: operador.EmpresaId,
            Rfc: {
                [Op.like]: `%${operador.Rfc}%`
            }
        }
    }).then(result => {
        console.log(`Se actualizo ${result[0]} columna(s) de la tabla UsuarioOperador`);
    });

    res.json('Se actualizo correctamente');
}

