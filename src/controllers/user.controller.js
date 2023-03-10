import bcrypt from "bcrypt";
import { Op } from "sequelize";
import Operador from "../database/models/Operador.model.js";
import User from "../database/models/User.model.js";
import UsuarioOperador from "../database/models/UsuarioOperador.model.js";
import { uuid } from "uuidv4";
import OperadorPeriodo from "../database/models/OperadorPeriodo.model.js";
import EmpresaCategoria from "../database/models/EmpresaCategoria.model.js";
import CategoriaOperador from "../database/models/CategoriaOperador.model.js";
import CategoriaOperadorTipoDocumento from "../database/models/CategoriaOperadorTipoDocumento.model.js";
import EmpresaUsuariosModulo from "../database/models/EmpresaUsuarioModulo.model.js";
import Empresa from "../database/models/Empresa.model.js";
import ModuloTipoUsuario from "../database/models/ModuloTipoUsuario.model.js";
import UsuariosRoles from "../database/models/UsuariosRoles.model.js";
import Accesos from "../database/models/Accesos.model.js";
import prefixempresas from "../arreglos/prefixempresas.js";
import sendMailProveedor from "../mails/proveedor/controldeempresa.js";
import sendMailProveedorConfirmacion from "../mails/proveedor/confirmacionaltas.js";

// Hash password
const encryPassword = (password, rounds = 8) => {
  return bcrypt.hashSync(password, rounds);
};

/* EndPoint para crear usuario Proveedor */
export const createUserProveedor = async (req, res) => {
  // Password hasheada
  const password_hash = encryPassword(req.body.PASS);

  // Periodos
  const periodos = [2021, 2022, 2023];

  // Obtener prefijo
  let prefijo;
  let abreviacion;
  prefixempresas.forEach((pfEmp) => {
    if (req.body.EmpresaId === pfEmp.UUID) {
      prefijo = pfEmp.prefix;
      abreviacion = pfEmp.abreviacion;
    }
  });

  /*
        Nombre del usuario que es el RFC combiando con el prefijo 
        Ejemplo:
        "CCO-ROPC031223H45"
    */
  let nameUser = `${prefijo}-${req.body.RFC}`;

  // Creando el usuario.
  User.create({
    NOMBREUSUARIO: nameUser,
    PASS: password_hash,
    IDROL: 2074,
    NOMBRE: req.body.NOMBRE,
    EMAIL: req.body.EMAIL,
    HABILITADO: 1,
  })
    .then((user) => {
      // Creando el operador.
      Operador.create({
        Uuid: uuid(),
        RazonSocial: req.body.NOMBRE,
        Rfc: req.body.RFC,
        EmpresaId: req.body.EmpresaId,
        CatalogoOperadorId: 1,
      })
        .then((operador) => {
          const addPeriodo = (año, mes) => {
            OperadorPeriodo.create({
              UUID: uuid(),
              Mes: mes,
              Ano: año,
              Activo: 1,
              CargaMaterialidad: 1,
              OperadorId: operador.dataValues.id,
            })
              .then((opper) => {
                // Filtra las categorias por empresa.
                EmpresaCategoria.findAll({
                  where: {
                    EmpresaId: req.body.EmpresaId,
                  },
                  attributes: ["id"],
                  order: [["id", "ASC"]],
                })
                  .then((empCategoria) => {
                    const arrayIdEmpCat = [];
                    empCategoria.forEach((element) => {
                      arrayIdEmpCat.push(element.dataValues.id);
                    });
                    empCategoria.forEach((element) => {
                      // Llena la tabla de CategoriaOperador.
                      CategoriaOperador.create({
                        Uuid: uuid(),
                        OperadorPeriodoId: opper.dataValues.id,
                        EmpresaCategoriumId: element.dataValues.id,
                      })
                        .then((catoperador) => {
                          const DUE_DILLIGENCE = [
                            14, 15, 16, 17, 18, 19, 20, 21, 22,
                          ];
                          const REGISTRO_CONTROL = [
                            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 80, 81,
                            82
                          ];
                          const REGISTRO_CONTROL2 = [
                            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 80, 81,
                            82, 90
                          ];
                          const ENTREGABLES = [23, 24, 25, 26];
                          if (
                            catoperador.dataValues.EmpresaCategoriumId ===
                            arrayIdEmpCat[0]
                          ) {
                            for (let i = 0; i < DUE_DILLIGENCE.length; i++) {
                              CategoriaOperadorTipoDocumento.create({
                                Uuid: uuid(),
                                RequireValidacion: 0,
                                HabilitadoDocumento: 1,
                                CategoriaOperadorId: catoperador.dataValues.id,
                                CatalogoTipoDocumentoId: DUE_DILLIGENCE[i],
                              }).then((catopDoc) => {});
                            }
                          } else if (
                            catoperador.dataValues.EmpresaCategoriumId ===
                            arrayIdEmpCat[1]
                          ) {
                            if (opper.dataValues.Ano === 2023) {
                              for (
                                let i = 0;
                                i < REGISTRO_CONTROL2.length;
                                i++
                              ) {
                                CategoriaOperadorTipoDocumento.create({
                                  Uuid: uuid(),
                                  RequireValidacion: 0,
                                  HabilitadoDocumento: 1,
                                  CategoriaOperadorId:
                                    catoperador.dataValues.id,
                                  CatalogoTipoDocumentoId: REGISTRO_CONTROL2[i],
                                }).then((catopDoc) => {});
                              }
                            } else if (
                              opper.dataValues.Ano === 2022 && opper.dataValues.Mes === 12
                            ) {
                              for (
                                let i = 0;
                                i < REGISTRO_CONTROL2.length;
                                i++
                              ) {
                                CategoriaOperadorTipoDocumento.create({
                                  Uuid: uuid(),
                                  RequireValidacion: 0,
                                  HabilitadoDocumento: 1,
                                  CategoriaOperadorId:
                                    catoperador.dataValues.id,
                                  CatalogoTipoDocumentoId: REGISTRO_CONTROL2[i],
                                }).then((catopDoc) => {});
                              }
                            } else {
                              for (
                                let i = 0;
                                i < REGISTRO_CONTROL.length;
                                i++
                              ) {
                                CategoriaOperadorTipoDocumento.create({
                                  Uuid: uuid(),
                                  RequireValidacion: 0,
                                  HabilitadoDocumento: 1,
                                  CategoriaOperadorId:
                                    catoperador.dataValues.id,
                                  CatalogoTipoDocumentoId: REGISTRO_CONTROL[i],
                                }).then((catopDoc) => {});
                              }
                            }
                          } else if (
                            catoperador.dataValues.EmpresaCategoriumId ===
                            arrayIdEmpCat[2]
                          ) {
                            for (let i = 0; i < ENTREGABLES.length; i++) {
                              CategoriaOperadorTipoDocumento.create({
                                Uuid: uuid(),
                                RequireValidacion: 0,
                                HabilitadoDocumento: 1,
                                CategoriaOperadorId: catoperador.dataValues.id,
                                CatalogoTipoDocumentoId: ENTREGABLES[i],
                              }).then((catopDoc) => {});
                            }
                          }
                        })
                        .catch((e) => {
                          res.json("Error en CategoriaOperador");
                        });
                    });
                  })
                  .catch((e) => {
                    res.json("Error en EmpresaCategoria");
                  });
              })
              .catch((e) => {
                res.json("Error en OperadorPeriodo");
              });
          };

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

          EmpresaUsuariosModulo.create({
            EmpresaId: req.body.EmpresaId,
            UsuarioNombreUsuario: nameUser,
            CatalogoModuloId: 5,
          })
            .then((empresausemod) => {
              ModuloTipoUsuario.create({
                EmpresaUsuarioModuloId: empresausemod.dataValues.id,
                CatalogoTipoUsuarioId: 2,
              })
                .then((modtipouser) => {
                  res.json(empresausemod.dataValues);
                  UsuarioOperador.create({
                    EmpresaId: req.body.EmpresaId,
                    Rfc: req.body.RFC,
                    ModuloTipoUsuarioId: modtipouser.dataValues.id,
                  })
                    .then((useroper) => {
                      UsuariosRoles.create({
                        Activo: 1,
                        Especial: "none",
                        UsuarioNombreUsuario: nameUser,
                        RoleId: 2,
                      })
                        .then((useroles) => {
                          const idPermission = [1, 2, 3, 5];

                          for (let i = 0; i < idPermission.length; i++) {
                            Accesos.create({
                              UsuariosRoleId: useroles.dataValues.id,
                              PermisoId: idPermission[i],
                              Activo: 1,
                            })
                              .then((access) => {})
                              .catch((e) => {
                                res.json("Se produjo un error en Accesos.");
                              });
                          }
                        })
                        .catch((e) => {
                          res.json("Se produjo un error en UsuariosRoles.");
                        });
                    })
                    .catch((e) => {
                      res.json("Se produjo un error en UsuarioOperador.");
                    });
                })
                .catch((e) => {
                  res.json("Se produjo un error en ModuloTipoUsuario.");
                });
            })
            .catch((e) => {
              console.log(e);
              res.json("Se produjo un error en EmpresaUsuariosModulo.");
            });
        })
        .catch((e) => {
          console.log(e);
          res.json("Se produjo un error en Operador.");
        });
    })
    .catch((e) => {
      console.log(e);
      res.json("Se produjo un error en Usuario.");
    });

  // Envio de Correo a proveedor.
  sendMailProveedor({
    razon_social: req.body.NOMBRE,
    correo: req.body.EMAIL,
    usuario: nameUser,
    clave: req.body.PASS,
    abreviacion: abreviacion,
  }).then((correo) => {
    console.log("Correo enviado");
  });

  Empresa.findByPk(req.body.EmpresaId).then((empresa) => {
    if (req.body.correocontratante1) {
      sendMailProveedorConfirmacion({
        correo: req.body.EMAIL,
        nombre: req.body.NOMBRE,
        razon_social_contratante: empresa.nombre,
        correo_contratante: req.body.correocontratante1,
        abreviacion: abreviacion,
      }).then(console.log("Envio confirmacion alta 1."));
    }
    if (req.body.correocontratante2) {
      sendMailProveedorConfirmacion({
        correo: req.body.EMAIL,
        nombre: req.body.NOMBRE,
        razon_social_contratante: empresa.nombre,
        correo_contratante: req.body.correocontratante2,
        abreviacion: abreviacion,
      }).then(console.log("Envio confirmacion alta 2."));
    }
  });
};

export const getUsers = async (req, res) => {
  const type_users = ["admin", "cliente", "proveedor"];
  User.findAll({
    attributes: ["UUID", "NOMBREUSUARIO", "NOMBRE", "EMAIL"],
    order: [["UUID", "DESC"]],
  }).then((usuario) => {
    res.json(usuario);
  });
};

export const getUserEmpresas = async (req, res) => {
  const user = await User.findByPk(req.params.id);

  EmpresaUsuariosModulo.findAll({
    where: {
      UsuarioNombreUsuario: user.NOMBREUSUARIO,
    },
    include: [Empresa],
  }).then((result) => {
    res.json(result);
  });
};

export const getUser = async (req, res) => {
  User.findByPk(req.params.id).then((result) => {
    res.json(result);
  });
};

export const changePassword = async (req, res) => {
  const password_hash = encryPassword(req.body.password);
  User.update(
    {
      PASS: password_hash,
    },
    {
      where: {
        UUID: req.params.id,
      },
    }
  ).then((user) => {
    res.json("Clave cambiada correctamente");
  });
};

export const updateRFCInternal = async (req, res) => {
  var operador = await Operador.findByPk(req.params.id, {
    attributes: ["id", "Rfc", "EmpresaId"],
  });

  await Operador.update(
    {
      Rfc: req.body.Rfc,
    },
    {
      where: {
        id: operador.id,
      },
    }
  ).then((result) => {
    console.log(`Se actualizo ${result[0]} columna(s) de la tabla Operador`);
  });

  await UsuarioOperador.update(
    {
      Rfc: req.body.Rfc,
    },
    {
      where: {
        EmpresaId: operador.EmpresaId,
        Rfc: {
          [Op.like]: `%${operador.Rfc}%`,
        },
      },
    }
  ).then((result) => {
    console.log(
      `Se actualizo ${result[0]} columna(s) de la tabla UsuarioOperador`
    );
  });

  res.json("Se actualizo correctamente");
};

export const updateEmail = async (req, res) => {
  User.update(
    {
      EMAIL: req.body.EMAIL,
    },
    {
      where: {
        UUID: req.params.id,
      },
    }
  ).then((user) => {
    res.json("Correo electronico actualizado.");
  });
};
