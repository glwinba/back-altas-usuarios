import bcrypt from "bcrypt";
import { EmptyResultError, Op } from "sequelize";
import Operador from "../database/models/Operador.model.js";
import User from "../database/models/User.model.js";
import UsuarioOperador from "../database/models/UsuarioOperador.model.js";
import { uuid } from 'uuidv4';
import OperadorPeriodo from "../database/models/OperadorPeriodo.model.js";
import EmpresaCategoria from "../database/models/EmpresaCategoria.model.js";
import CategoriaOperador from "../database/models/CategoriaOperador.model.js";
import CategoriaOperadorTipoDocumento from "../database/models/CategoriaOperadorTipoDocumento.model.js";

// Hash password
const encryPassword = (password, rounds = 8) => {
    return bcrypt.hashSync(password, rounds);
}



/* EndPoint para crear usuario Proveedor */
export const createUserProveedor = async (req, res) => {
    // Password hasheada
    const password_hash = encryPassword(req.body.PASS);
    
    // Periodos
    const periodos = [2021, 2022, 2023];
    
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
            const addPeriodo = (año, mes) => {
                OperadorPeriodo.create({
                    UUID: uuid(),
                    Mes: mes,
                    Ano: año,
                    Activo: 1,
                    CargaMaterialidad: 1,
                    OperadorId: operador.dataValues.id
                }).then(opper => {
                    // Filtra las categorias por empresa.
                    EmpresaCategoria.findAll({
                        where: {
                            EmpresaId: req.body.EmpresaId
                        },
                        attributes: ['id']
                    }).then(empCategoria => {
                        empCategoria.forEach(element => {
                            // Llena la tabla de CategoriaOperador.
                            CategoriaOperador.create({
                                Uuid: uuid(),
                                OperadorPeriodoId: opper.dataValues.id,
                                EmpresaCategoriumId: element.dataValues.id
                            }).then(catoperador => {
                                    const DUE_DILLIGENCE = [14,15,16,17,18,19,20,21,22];
                                    const REGISTRO_CONTROL = [1,2,3,4,5,6,7,8,9,10,11,12,13,80,81,82];
                                    const ENTREGABLES = [23,24,25,26];
                                    // console.log(catoperador.dataValues);
                                    if (catoperador.dataValues.EmpresaCategoriumId === 171) {
                                            for (let i = 0; i < DUE_DILLIGENCE.length; i++) {
                                                CategoriaOperadorTipoDocumento.create({
                                                    Uuid: uuid(),
                                                    RequireValidacion: 0,
                                                    HabilitadoDocumento: 1,
                                                    CategoriaOperadorId: catoperador.dataValues.id,
                                                    CatalogoTipoDocumentoId: DUE_DILLIGENCE[i]
                                                }).then(catopDoc => {

                                                })
                                            }
                                        } else if (catoperador.dataValues.EmpresaCategoriumId === 172) {
                                            for (let i = 0; i < REGISTRO_CONTROL.length; i++) {
                                                CategoriaOperadorTipoDocumento.create({
                                                    Uuid: uuid(),
                                                    RequireValidacion: 0,
                                                    HabilitadoDocumento: 1,
                                                    CategoriaOperadorId: catoperador.dataValues.id,
                                                    CatalogoTipoDocumentoId: REGISTRO_CONTROL[i]
                                                }).then(catopDoc => {

                                                })
                                            }
                                        } else if (catoperador.dataValues.EmpresaCategoriumId === 173) {
                                            for (let i = 0; i < ENTREGABLES.length; i++) {
                                                CategoriaOperadorTipoDocumento.create({
                                                    Uuid: uuid(),
                                                    RequireValidacion: 0,
                                                    HabilitadoDocumento: 1,
                                                    CategoriaOperadorId: catoperador.dataValues.id,
                                                    CatalogoTipoDocumentoId: ENTREGABLES[i]
                                                }).then(catopDoc => {

                                                })
                                            }
                                        }
                                }
                            );
                        });
                        
                    });
                    
                });
            }

            for (let i = 0; i < periodos.length; i++) {
                if (periodos[i] === periodos[0]) {
                    for (let j = 10; j <= 12; j++) {
                        addPeriodo(periodos[i], j);
                    }
                } else {
                    for (let j = 1; j <= 12; j++) {
                        addPeriodo(periodos[i], j);
                    }
                }
            }
    

            res.json(`Se agrego correctamente el usuario ${req.body.NOMBREUSUARIO}`);
        })
        .catch( e => {
            console.log(e);
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

