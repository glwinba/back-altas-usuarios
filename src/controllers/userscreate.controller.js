import reader from "xlsx";
import bcrypt from "bcrypt";
import Operador from "../database/models/Operador.model.js";
import User from "../database/models/User.model.js";
import UsuarioOperador from "../database/models/UsuarioOperador.model.js";
import { uuid } from "uuidv4";
import OperadorPeriodo from "../database/models/OperadorPeriodo.model.js";
import EmpresaCategoria from "../database/models/EmpresaCategoria.model.js";
import CategoriaOperador from "../database/models/CategoriaOperador.model.js";
import CategoriaOperadorTipoDocumento from "../database/models/CategoriaOperadorTipoDocumento.model.js";
import EmpresaUsuariosModulo from "../database/models/EmpresaUsuarioModulo.model.js";
import ModuloTipoUsuario from "../database/models/ModuloTipoUsuario.model.js";
import UsuariosRoles from "../database/models/UsuariosRoles.model.js";
import Accesos from "../database/models/Accesos.model.js";
import prefixempresas from "../arreglos/prefixempresas.js";
import sendMailProveedor from "../mails/proveedor/controldeempresa.js";
import mimeTypes from "mime-types";
import fs from "fs";
import sendMailAdministradorConfirmacion from "../mails/admin/confirmacionaltas.js";
import OperadorCliente from "../database/models/OperadorCliente.model.js";
import OperadorPeriodoCliente from "../database/models/OperadorPeriodoCliente.model.js";
import EmpresaCategoriaCliente from "../database/models/EmpresaCategoriaCliente.model.js";
import CategoriaOperadorCliente from "../database/models/CategoriaOperadorCliente.model.js";
import CategoriaOperadorTipoDocumentoCliente from "../database/models/CategoriaOperadorTipoDocumentoCliente.model.js";
import ModuloTipoUsuarioClientes from "../database/models/ModuloTipoUsuarioClientes.model.js";
import UsuarioOperadorClientes from "../database/models/UsuarioOperadorClientes.model.js";
import UsuariosRolesClientes from "../database/models/UsuariosRolesClientes.model.js";
import AccesosClientes from "../database/models/AccesosClientes.model.js";

const encryPassword = (password, rounds = 8) => {
  return bcrypt.hashSync(password, rounds);
};

const generatePassword = () => {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let pass = "";

  for (let i = 0; i < 10; i++) {
    pass += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }

  let concatenar = pass.replace(pass[Math.round(Math.random() * 9)], "@");
  return concatenar;
};

const uploadFile = async (myFile) => {
  const fileData = myFile;

  const path =
    __dirname +
    "/files/" +
    Date.now() +
    "." +
    mimeTypes.extension(fileData.mimetype);

  await fileData.mv(path, (err) => {
    if (err) {
      console.log(err);
    }
    console.log("Archivo subido correctamente");
  });

  return path;
};

const deleteFileLaterUpload = (filePath) => {
  fs.access(filePath, (error) => {
    if (!error) {
      fs.unlinkSync(filePath);
      console.log("Archivo eliminado");
    } else {
      console.error("Error al eliminar archivo: ", error);
    }
  });
};

export const readExcel = async (req, res) => {
  let path = await uploadFile(req.files.file);

  setTimeout(async () => {
    const file = reader.readFile(path);

    let data = [];
    const sheets = file.SheetNames;

    for (let i = 0; i < sheets.length; i++) {
      if (sheets[i] === "PROVEEDOR") {
        const temp = reader.utils.sheet_to_json(
          file.Sheets[file.SheetNames[i]]
        );  

        temp.forEach((respuesta) => {
          data.push(respuesta);
        });
      }
    }

    res.json(data);
    deleteFileLaterUpload(path);
  }, 5000);
};

export const createUserProveedorMasive = async (req, res) => {
  // Password hasheada
  const password = generatePassword();
  const password_hash = encryPassword(password);

  // Periodos
  const periodos = [2021, 2022, 2023];

  // Obtener prefijo
  let prefijo;
  let abreviacion;

  // Obtener las Hojas

  for (const pfEmp of prefixempresas) {
    if (pfEmp.UUID == req.body.EmpresaId) {
      prefijo = pfEmp.prefix;
      abreviacion = pfEmp.abreviacion;
    }
  }

  // Creando el usuario de manera masiva.

  for (const userDATA of req.body.dataExcel) {
    let userName = `${prefijo}-${userDATA.RFCPROVEEDOR}`;

    User.create({
      NOMBREUSUARIO: userName,
      PASS: password_hash,
      IDROL: 2074,
      NOMBRE: userDATA.RAZONSOCIALPROVEEDOR,
      EMAIL: userDATA.EMAIL,
      HABILITADO: 1,
    })
      .then((user) => {
        // Creando el operador.
        Operador.create({
          Uuid: uuid(),
          RazonSocial: userDATA.RAZONSOCIALPROVEEDOR,
          Rfc: userDATA.RFCPROVEEDOR,
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
                              82,
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
                                  CategoriaOperadorId:
                                    catoperador.dataValues.id,
                                  CatalogoTipoDocumentoId: DUE_DILLIGENCE[i],
                                }).then((catopDoc) => {});
                              }
                            } else if (
                              catoperador.dataValues.EmpresaCategoriumId ===
                              arrayIdEmpCat[1]
                            ) {
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
                            } else if (
                              catoperador.dataValues.EmpresaCategoriumId ===
                              arrayIdEmpCat[2]
                            ) {
                              for (let i = 0; i < ENTREGABLES.length; i++) {
                                CategoriaOperadorTipoDocumento.create({
                                  Uuid: uuid(),
                                  RequireValidacion: 0,
                                  HabilitadoDocumento: 1,
                                  CategoriaOperadorId:
                                    catoperador.dataValues.id,
                                  CatalogoTipoDocumentoId: ENTREGABLES[i],
                                }).then((catopDoc) => {});
                              }
                            }
                          })
                          .catch((e) => {
                            console.log(e);
                          });
                      });
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                })
                .catch((e) => {
                  console.log(e);
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
              UsuarioNombreUsuario: userName,
              CatalogoModuloId: 5,
            })
              .then((empresausemod) => {
                ModuloTipoUsuario.create({
                  EmpresaUsuarioModuloId: empresausemod.dataValues.id,
                  CatalogoTipoUsuarioId: 2,
                })
                  .then((modtipouser) => {
                    UsuarioOperador.create({
                      EmpresaId: req.body.EmpresaId,
                      Rfc: userDATA.RFCPROVEEDOR,
                      ModuloTipoUsuarioId: modtipouser.dataValues.id,
                    })
                      .then((useroper) => {
                        UsuariosRoles.create({
                          Activo: 1,
                          Especial: "none",
                          UsuarioNombreUsuario: userName,
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
                                  console.log(e);
                                });
                            }
                          })
                          .catch((e) => {
                            console.log(e);
                          });
                      })
                      .catch((e) => {
                        console.log(e);
                      });
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              })
              .catch((e) => {
                console.log(e);
              });
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });

    // Envio de Correo a proveedor.
    sendMailProveedor({
      razon_social: userDATA.RAZONSOCIALPROVEEDOR,
      correo: userDATA.EMAIL,
      usuario: userName,
      clave: password,
      abreviacion: abreviacion,
    }).then((correo) => console.log("Correo enviado"));
    console.log("Usuario creado");
  }

  res.json(`Se agrego correctamente los usuarios`);
};

export const addEmpresUser = async (req, res) => {
  const periodos = [2021, 2022, 2023];
  const usuario = req.body.usuario;
  const rfc = usuario.NOMBREUSUARIO.split("-")[1];
  for (const user_empresa of req.body.empresasusuarios) {
    Operador.create({
      Uuid: uuid(),
      RazonSocial: usuario.NOMBRE,
      Rfc: rfc,
      EmpresaId: user_empresa.id,
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
                  EmpresaId: user_empresa.id,
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
                          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 80, 81, 82,
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
                          for (let i = 0; i < REGISTRO_CONTROL.length; i++) {
                            CategoriaOperadorTipoDocumento.create({
                              Uuid: uuid(),
                              RequireValidacion: 0,
                              HabilitadoDocumento: 1,
                              CategoriaOperadorId: catoperador.dataValues.id,
                              CatalogoTipoDocumentoId: REGISTRO_CONTROL[i],
                            }).then((catopDoc) => {});
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
          EmpresaId: user_empresa.id,
          UsuarioNombreUsuario: usuario.NOMBREUSUARIO,
          CatalogoModuloId: 5,
        })
          .then((empresausemod) => {
            ModuloTipoUsuario.create({
              EmpresaUsuarioModuloId: empresausemod.dataValues.id,
              CatalogoTipoUsuarioId: 2,
            })
              .then((modtipouser) => {
                UsuarioOperador.create({
                  EmpresaId: user_empresa.id,
                  Rfc: rfc,
                  ModuloTipoUsuarioId: modtipouser.dataValues.id,
                })
                  .then((useroper) => {
                    UsuariosRoles.create({
                      Activo: 1,
                      Especial: "none",
                      UsuarioNombreUsuario: usuario.NOMBREUSUARIO,
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
        res.json("Se produjo un error en Operador.");
      });
  }
  res.json("Se agregaron correctamente las nuevas empresas al usuario.");
};

export const createUserAdmin = async (req, res) => {
  const password_hash = encryPassword(req.body.password);

  let prefijo;
  let abreviacion;

  for (const pfEmp of prefixempresas) {
    if (pfEmp.UUID == req.body.EmpresaId) {
      prefijo = pfEmp.prefix;
      abreviacion = pfEmp.abreviacion;
    }
  }
  let firstName = req.body.NOMBRE.split(" ")[0];
  let apellido = req.body.NOMBRE.split(" ")[1];

  let firstLetter = firstName.split("")[0];

  let userName = `${prefijo}-${firstLetter}${apellido}`;

  User.create({
    NOMBREUSUARIO: userName,
    PASS: password_hash,
    IDROL: 2073,
    NOMBRE: req.body.NOMBRE,
    EMAIL: req.body.EMAIL,
    HABILITADO: 1,
  }).then((user) => {
    EmpresaUsuariosModulo.create({
      EmpresaId: req.body.EmpresaId,
      UsuarioNombreUsuario: userName,
      CatalogoModuloId: 5,
    }).then((empusermodule) => {
      ModuloTipoUsuario.create({
        EmpresaUsuarioModuloId: empusermodule.dataValues.id,
        CatalogoTipoUsuarioId: 1,
      }).then((moduletypeuser) => {
        UsuarioOperador.create({
          EmpresaId: req.body.EmpresaId,
          Rfc: null,
          ModuloTipoUsuarioId: moduletypeuser.dataValues.id,
        }).then((userop) => {
          UsuariosRoles.create({
            Activo: 1,
            Especial: "all-access",
            UsuarioNombreUsuario: userName,
            RoleId: null,
          }).then((userrol) => {
            res.json(userrol.dataValues);
          });
        });
      });
    });
  });

  sendMailAdministradorConfirmacion({
    correo: req.body.EMAIL,
    nombre: req.body.NOMBRE,
    nombreusuario: userName,
    password: req.body.password,
    abreviacion: abreviacion,
  }).then((correo) => console.log("Correo enviado correctamente"));
};

export const createUserCliente = async (req, res) => {
  // Password hasheada
  const password_hash = encryPassword(req.body.PASS);

  // Periodos
  const periodos = [2021, 2022, 2023];

  // Obtener prefijo
  let prefijo;
  prefixempresas.forEach((pfEmp) => {
    if (req.body.EmpresaId === pfEmp.UUID) {
      prefijo = pfEmp.prefix;
    }
  });

  /*
        Nombre del usuario que es el RFC combiando con el prefijo 
        Ejemplo:
        "CCCO-ROPC031223H45"
    */
  let nameUser = `C${prefijo}-${req.body.RFC}`;

  // Creando el usuario.
  User.create({
    NOMBREUSUARIO: nameUser,
    PASS: password_hash,
    IDROL: 2075,
    NOMBRE: req.body.NOMBRE,
    EMAIL: req.body.EMAIL,
    HABILITADO: 1,
  })
    .then((user) => {
      // Creando el operador cliente.
      OperadorCliente.create({
        Uuid: uuid(),
        RazonSocial: req.body.NOMBRE,
        Rfc: req.body.RFC,
        EmpresaId: req.body.EmpresaId,
        CatalogoOperadorId: 1,
      })
        .then((operador) => {
          const addPeriodo = (año, mes) => {
            OperadorPeriodoCliente.create({
              UUID: uuid(),
              Mes: mes,
              Ano: año,
              Activo: 1,
              CargaMaterialidad: 1,
              OperadorId: operador.dataValues.id,
            })
              .then((opper) => {
                // Filtra las categorias por empresa.
                EmpresaCategoriaCliente.findAll({
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
                      // Llena la tabla de CategoriaOperadorCliente.
                      CategoriaOperadorCliente.create({
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
                            82,
                          ];
                          const ENTREGABLES = [23, 24, 25, 26];
                          if (
                            catoperador.dataValues.EmpresaCategoriumId ===
                            arrayIdEmpCat[0]
                          ) {
                            for (let i = 0; i < DUE_DILLIGENCE.length; i++) {
                              CategoriaOperadorTipoDocumentoCliente.create({
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
                            for (let i = 0; i < REGISTRO_CONTROL.length; i++) {
                              CategoriaOperadorTipoDocumentoCliente.create({
                                Uuid: uuid(),
                                RequireValidacion: 0,
                                HabilitadoDocumento: 1,
                                CategoriaOperadorId: catoperador.dataValues.id,
                                CatalogoTipoDocumentoId: REGISTRO_CONTROL[i],
                              }).then((catopDoc) => {});
                            }
                          } else if (
                            catoperador.dataValues.EmpresaCategoriumId ===
                            arrayIdEmpCat[2]
                          ) {
                            for (let i = 0; i < ENTREGABLES.length; i++) {
                              CategoriaOperadorTipoDocumentoCliente.create({
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
            CatalogoModuloId: 6,
          })
            .then((empresausemod) => {
              ModuloTipoUsuarioClientes.create({
                EmpresaUsuarioModuloId: empresausemod.dataValues.id,
                CatalogoTipoUsuarioId: 2,
              })
                .then((modtipouser) => {
                  res.json(empresausemod.dataValues);
                  UsuarioOperadorClientes.create({
                    EmpresaId: req.body.EmpresaId,
                    Rfc: req.body.RFC,
                    ModuloTipoUsuarioId: modtipouser.dataValues.id,
                  })
                    .then((useroper) => {
                      UsuariosRolesClientes.create({
                        Activo: 1,
                        Especial: "none",
                        UsuarioNombreUsuario: nameUser,
                        RoleId: 2,
                      })
                        .then((useroles) => {
                          const idPermission = [1, 2, 3, 5];

                          for (let i = 0; i < idPermission.length; i++) {
                            AccesosClientes.create({
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
          res.json("Se produjo un error en Operador.");
        });
    })
    .catch((e) => {
      console.log(e);
      res.json("Se produjo un error en Usuario.");
    });
}
