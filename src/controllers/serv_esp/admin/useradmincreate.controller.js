import { BuildingNameAdmin } from "../../../helpers/namesusers";
import { generatePassword, hashPassword } from "../../../helpers/passwords";
import { findExtraData } from "../../../helpers/prefix";
import { UserCreate } from "../../user.controller";
import { ModuleTypeUserCreate } from "../moduletypeuser.controller";
import { UserCompanyModuleCreate } from "../usercompanymodule.controller";
import { OperatorUserCreate } from "../operatoruser.controller";
import { RolUsersCreate } from "../rolusers.controller";
import sendMailAdministradorConfirmacion from "../../../mails/admin/confirmacionaltas";
import {
  UserAccessCreate,
  UserAccessCreateComplete,
} from "../useraccess.controller";
import User from "../../../database/models/User.model";

export const CreateUserAdminIndividual = async (
  NOMBRE,
  EMAIL,
  EmpresaId,
  sendMail,
  permissions
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
    const nameUser = await BuildingNameAdmin(prefix, NOMBRE);
    // Creando el usuario.
    const user = await UserCreate(nameUser, password_hash, NOMBRE, EMAIL, 2073);
    const usercompanymodule = await UserCompanyModuleCreate(
      EmpresaId,
      nameUser,
      5
    );
    const moduletypeuser = await ModuleTypeUserCreate(usercompanymodule.id, 1);
    const operatoruser = await OperatorUserCreate(
      EmpresaId,
      moduletypeuser.id,
      null
    );

    if (permissions.length > 0) {
      const rolusers = await RolUsersCreate(nameUser, "none", null);
      for (const permission of permissions) {
        const permissionUsers = await UserAccessCreate(
          rolusers.id,
          permission.id
        );
      }
    } else {
      const rolusers = await RolUsersCreate(nameUser, "all-access", null);
    }

    // Envio de Correo a proveedor.
    if (sendMail) {
      await sendMailAdministradorConfirmacion({
        correo: EMAIL,
        nombre: NOMBRE,
        nombreusuario: nameUser,
        password: PASS,
        abreviacion: abbreviation,
      });
    }

    console.log("Se creo el usuario correctamente");
    console.log({
      nombre: nameUser,
      pass: PASS
    })
    return {
      nombre: nameUser,
      pass: PASS,
    };
  } catch (error) {
    return console.log(error);
  }
};

export const CreateUserAdminMasive = async (
  EmpresaId,
  DataExcel,
  sendMail,
  permissions
) => {
  let array_users = [];
  try {
    // Creando el usuario de manera masiva.
    for (const data of DataExcel) {
      const user = await CreateUserAdminIndividual(
        data.NOMBREADMIN,
        data.MAILADMIN,
        EmpresaId,
        sendMail,
        permissions
      );
      array_users.push(user);
    }
    console.log(array_users);
    return console.log("Se crearon de manera multiple los usuarios.");
  } catch (error) {
    return console.log(error);
  }
};

export const CreateUserAdmin = async (req, res) => {
  try {
    if (req.body.dataExcel) {
      await CreateUserAdminMasive(
        req.body.EmpresaId,
        req.body.dataExcel,
        req.body.sendMail,
        req.body.permissions
      );
    } else {
      await CreateUserAdminIndividual(
        req.body.NOMBRE,
        req.body.EMAIL,
        req.body.EmpresaId,
        req.body.sendMail,
        req.body.permissions
      );
    }

    res.json("Usario(s) Creado(s) correctamente.");
  } catch (error) {
    console.log(error);
    res.json("error");
  }
};

export const CreateAdminAssociateCompanie = async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id);
  const usercompanymodule = await UserCompanyModuleCreate(
    req.body.EmpresaId,
    user.NOMBREUSUARIO,
    5
  );
  const moduletypeuser = await ModuleTypeUserCreate(usercompanymodule.id, 1);
  const operatoruser = await OperatorUserCreate(
    req.body.EmpresaId,
    moduletypeuser.id,
    null
  );
  res.json("Empresa agregada correctamente.")
};
