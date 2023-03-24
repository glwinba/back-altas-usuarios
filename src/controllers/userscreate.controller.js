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
import { UserCreate } from "./user.controller.js";
import { findExtraData } from "../helpers/prefix.js";
import { generatePassword, hashPassword } from "../helpers/passwords.js";
import { OperatorCreate } from "./serv_esp/operator.controller.js";
import { PeriodsCreate } from "./serv_esp/operatorperiod.controller.js";
import { FindCategoryCompanyById } from "./empresacategoria.controller.js";
import { OperatorCategoryCreateComplete } from "./serv_esp/operatorcategory.controller.js";
import { CategoryOperatorTypeDocumentCreateComplete } from "./serv_esp/categoryoperatortypedocument.controller.js";
import { BuildingNameSupplier } from "../helpers/namesusers.js";
import { UserCompanyModuleCreate } from "./serv_esp/usercompanymodule.controller.js";
import { ModuleTypeUserCreate } from "./serv_esp/moduletypeuser.controller.js";
import { OperatorUserCreate } from "./serv_esp/operatoruser.controller.js";
import { RolUsersCreate } from "./serv_esp/rolusers.controller.js";
import { UserAccessCreateComplete } from "./serv_esp/useraccess.controller.js";
import Empresa from "../database/models/Empresa.model.js";
import sendMailProveedorConfirmacion from "../mails/proveedor/confirmacionaltas.js";

const encryPassword = (password, rounds = 8) => {
  return bcrypt.hashSync(password, rounds);
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

// Insert Proveedor ----------------------------------------

export const CreateUserProveedorIndividual = async (
  NOMBRE,
  EMAIL,
  RFC,
  EmpresaId,
  correocontratante1,
  correocontratante2,
  AreaServicio,
  sendMail
) => {
  try {
    // Password hasheada
    const PASS = await generatePassword();
    const password_hash = await hashPassword(PASS);

    // Obtener prefijo
    const prefijo = await findExtraData(EmpresaId);
    const { prefix, abbreviation } = prefijo;

    /*
        Nombre del usuario que es el RFC combiando con el prefijo 
        Ejemplo:
        "CCO-ROPC031223H45"
    */
    const nameUser = await BuildingNameSupplier(prefix, RFC);
    // Creando el usuario.
    const user = await UserCreate(nameUser, password_hash, NOMBRE, EMAIL, 2074);
    const operator = await OperatorCreate(NOMBRE, RFC, EmpresaId, AreaServicio);
    const operatorperiod = await PeriodsCreate(operator.id);
    const categorycompanies = await FindCategoryCompanyById(EmpresaId);
    const operatorcategory = await OperatorCategoryCreateComplete(
      categorycompanies,
      operatorperiod
    );
    const operatorcategorytypedocument =
      await CategoryOperatorTypeDocumentCreateComplete(
        operatorcategory,
        categorycompanies
      );
    const usercompanymodule = await UserCompanyModuleCreate(
      EmpresaId,
      nameUser,
      5
    );
    const moduletypeuser = await ModuleTypeUserCreate(usercompanymodule.id);
    const operatoruser = await OperatorUserCreate(
      EmpresaId,
      moduletypeuser.id,
      RFC
    );
    const rolusers = await RolUsersCreate(nameUser);
    const permissionUsers = await UserAccessCreateComplete(rolusers.id);

    // Envio de Correo a proveedor.
    if (sendMail) {
      await sendMailProveedor({
        razon_social: NOMBRE,
        correo: EMAIL,
        usuario: nameUser,
        clave: PASS,
        abreviacion: abbreviation,
      });

      const CompanyName = await Empresa.findByPk(EmpresaId);
      if (correocontratante1) {
        await sendMailProveedorConfirmacion({
          correo: EMAIL,
          nombre: NOMBRE,
          razon_social_contratante: CompanyName.nombre,
          correo_contratante: correocontratante1,
          abreviacion: abbreviation,
        });
      }
      if (correocontratante2) {
        await sendMailProveedorConfirmacion({
          correo: EMAIL,
          nombre: NOMBRE,
          razon_social_contratante: CompanyName.nombre,
          correo_contratante: correocontratante2,
          abreviacion: abbreviation,
        });
      }
    }

    return console.log("Se creo el usuario correctamente");
  } catch (error) {
    return console.log(error);
  }
};

export const CreateUserProveedorMasive = async (EmpresaId, DataExcel, sendMail) => {
  try {
    // Creando el usuario de manera masiva.
    for (const data of DataExcel) {
      await CreateUserProveedorIndividual(
        data.RAZONSOCIALPROVEEDOR,
        data.MAILPROVEEDOR,
        data.RFCPROVEEDOR,
        EmpresaId,
        data.MAILEMPRESACONTRATANTE1,
        data.MAILEMPRESACONTRATANTE2,
        data.AREASERVICIO,
        sendMail
      );
    }
    return console.log("Se crearon de manera multiple los usuarios.");
  } catch (error) {
    return console.log(error);
  }
};

export const CreateUserProveedor = async (req, res) => {
  try {
    if (req.body.dataExcel) {
      await CreateUserProveedorMasive(
        req.body.EmpresaId,
        req.body.dataExcel,
        req.body.sendMail
      );
    } else {
      await CreateUserProveedorIndividual(
        req.body.NOMBRE,
        req.body.EMAIL,
        req.body.RFC,
        req.body.EmpresaId,
        req.body.correocontratante1,
        req.body.correocontratante2,
        req.body.AreaServicio,
        req.body.sendMail
      );
    }

    res.json("Usario(s) Creado(s) correctamente.");
  } catch (error) {
    console.log(error);
    res.json("error");
  }
};

// --------------------------------------------------

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
                        const REGISTRO_CONTROL2 = [
                          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 80, 81, 82,
                          90,
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
                            for (let i = 0; i < REGISTRO_CONTROL2.length; i++) {
                              CategoriaOperadorTipoDocumento.create({
                                Uuid: uuid(),
                                RequireValidacion: 0,
                                HabilitadoDocumento: 1,
                                CategoriaOperadorId: catoperador.dataValues.id,
                                CatalogoTipoDocumentoId: REGISTRO_CONTROL2[i],
                              }).then((catopDoc) => {});
                            }
                          } else if (
                            opper.dataValues.Ano === 2022 &&
                            opper.dataValues.Mes === 12
                          ) {
                            for (let i = 0; i < REGISTRO_CONTROL2.length; i++) {
                              CategoriaOperadorTipoDocumento.create({
                                Uuid: uuid(),
                                RequireValidacion: 0,
                                HabilitadoDocumento: 1,
                                CategoriaOperadorId: catoperador.dataValues.id,
                                CatalogoTipoDocumentoId: REGISTRO_CONTROL2[i],
                              }).then((catopDoc) => {});
                            }
                          } else {
                            for (let i = 0; i < REGISTRO_CONTROL.length; i++) {
                              CategoriaOperadorTipoDocumento.create({
                                Uuid: uuid(),
                                RequireValidacion: 0,
                                HabilitadoDocumento: 1,
                                CategoriaOperadorId: catoperador.dataValues.id,
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
