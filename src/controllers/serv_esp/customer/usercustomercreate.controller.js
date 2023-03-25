import { BuildingNameCustomer } from "../../../helpers/namesusers";
import { generatePassword, hashPassword } from "../../../helpers/passwords";
import { findExtraData } from "../../../helpers/prefix";
import { UserCreate } from "../../user.controller";
import { CategoryOperatorTypeDocumentCreateComplete } from "./categoryoperatortypedocument.controller";
import { UserCompanyModuleCreate } from "../usercompanymodule.controller";
import { FindCategoryCompanyById } from "./empresacategoria.controller";
import { ModuleTypeUserCreate } from "./moduletypeuser.controller";
import { OperatorCreate } from "./operator.controller";
import { OperatorCategoryCreateComplete } from "./operatorcategory.controller";
import { PeriodsCreate } from "./operatorperiod.controller";
import { OperatorUserCreate } from "./operatoruser.controller";
import { RolUsersCreate } from "./rolusers.controller";
import { UserAccessCreateComplete } from "./useraccess.controller";
import sendMailProveedor from "../../../mails/proveedor/controldeempresa";

export const CreateUserCustomerIndividual = async (
  NOMBRE,
  EMAIL,
  RFC,
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
    const nameUser = await BuildingNameCustomer(prefix, RFC);
    // Creando el usuario.
    const user = await UserCreate(nameUser, password_hash, NOMBRE, EMAIL, 2075);
    const operator = await OperatorCreate(NOMBRE, RFC, EmpresaId);
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
      6
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
    /* PENDIENTE EN CLIENTES */
    if (sendMail) {
      await sendMailProveedor({
        razon_social: NOMBRE,
        correo: EMAIL,
        usuario: nameUser,
        clave: PASS,
        abreviacion: abbreviation,
      });
    }

    return console.log("Se creo el usuario correctamente");
  } catch (error) {
    return console.log(error);
  }
};

export const CreateUserCustomerMasive = async (
  EmpresaId,
  DataExcel,
  sendMail
) => {
  try {
    // Creando el usuario de manera masiva.
    for (const data of DataExcel) {
      await CreateUserCustomerIndividual(
        data.RAZONSOCIALPROVEEDOR,
        data.MAILPROVEEDOR,
        data.RFCPROVEEDOR,
        EmpresaId,
        sendMail
      );
    }
    return console.log("Se crearon de manera multiple los usuarios.");
  } catch (error) {
    return console.log(error);
  }
};

export const CreateUserCustomer = async (req, res) => {
  try {
    if (req.body.dataExcel) {
      await CreateUserCustomerMasive(
        req.body.EmpresaId,
        req.body.dataExcel,
        req.body.sendMail
      );
    } else {
      await CreateUserCustomerIndividual(
        req.body.NOMBRE,
        req.body.EMAIL,
        req.body.RFC,
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
