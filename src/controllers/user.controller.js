import bcrypt from "bcrypt";
import { Op } from "sequelize";
import Operador from "../database/models/Operador.model.js";
import User from "../database/models/User.model.js";
import UsuarioOperador from "../database/models/UsuarioOperador.model.js";
import { uuid } from 'uuidv4';
import OperadorPeriodo from "../database/models/OperadorPeriodo.model.js";

// Hash password
const encryPassword = (password, rounds = 8) => {
    return bcrypt.hashSync(password, rounds);
}

// Periodos
const periodos = [2021, 2022, 2023]

/* EndPoint para crear usuario Proveedor */
export const createUserProveedor = async (req, res) => {
    const password_hash = encryPassword(req.body.PASS);
    User.create({
        NOMBREUSUARIO: req.body.NOMBREUSUARIO,
        PASS: password_hash,
        IDROL: 2074,
        NOMBRE: req.body.NOMBRE,
        EMAIL: req.body.EMAIL,
        HABILITADO: 1
    }).then( user => {
        Operador.create({
            Uuid: uuid(),
            RazonSocial: req.body.NOMBRE,
            Rfc: req.body.NOMBREUSUARIO,
            EmpresaId: req.body.EmpresaId,
            CatalogoOperadorId: 1,
        }).then(operador => {
            const addPeriodo = async (año, mes) => {
                await OperadorPeriodo.create({
                    UUID: uuid(),
                    Mes: mes,
                    Ano: año,
                    Activo: 1,
                    CargaMaterialidad: 1,
                    OperadorId: operador.dataValues.id
                });
            }

            for (let i = 0; i < periodos.length; i++) {
                if (periodos[i] === periodos[0]) {
                    for (let j = 10; j <= 12; j++) {
                        addPeriodo(periodos[i], j)
                    }
                } else {
                    for (let j = 1; j <= 12; j++) {
                        addPeriodo(periodos[i], j)
                    }
                }
            }

            res.json(`Se agrego correctamente el usuario ${req.body.NOMBREUSUARIO}`);

        })
        .catch( e => {
            res.json('Se produjo un error Operador.');
        })
    }).catch( e => {
        console.log(e);
        res.json('Se produjo un error Usuario.');
    })
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

