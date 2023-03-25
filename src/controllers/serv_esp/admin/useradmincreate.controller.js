import { BuildingNameAdmin } from "../../../helpers/namesusers";
import { generatePassword, hashPassword } from "../../../helpers/passwords";
import { findExtraData } from "../../../helpers/prefix";
import { UserCreate } from "../../user.controller";
import { ModuleTypeUserCreate } from "../moduletypeuser.controller";
import { UserCompanyModuleCreate } from "../usercompanymodule.controller";
import { OperatorUserCreate } from "../operatoruser.controller";
import { RolUsersCreate } from "../rolusers.controller";
import sendMailAdministradorConfirmacion from "../../../mails/admin/confirmacionaltas";

export const CreateUserAdminIndividual = async (
  NOMBRE,
  EMAIL,
  EmpresaId,
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
    const rolusers = await RolUsersCreate(nameUser, "all-access", null);

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

    return console.log("Se creo el usuario correctamente");
  } catch (error) {
    return console.log(error);
  }
};

export const CreateUserAdminMasive = async (
  EmpresaId,
  DataExcel,
  sendMail
) => {
  try {
    // Creando el usuario de manera masiva.
    for (const data of DataExcel) {
      await CreateUserAdminIndividual(
        data.NOMBREADMIN,
        data.MAILADMIN,
        EmpresaId,
        sendMail
      );
    }
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
        req.body.sendMail
      );
    } else {
      await CreateUserAdminIndividual(
        req.body.NOMBRE,
        req.body.EMAIL,
        req.body.EmpresaId,
        req.body.sendMail
      );
    }

    res.json("Usario(s) Creado(s) correctamente.");
  } catch (error) {
    console.log(error);
    res.json("error");
  }
};
