import reader from "xlsx";
import sendMailProveedor from "../mails/proveedor/controldeempresa.js";
import mimeTypes from "mime-types";
import fs from "fs";
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
    const moduletypeuser = await ModuleTypeUserCreate(usercompanymodule.id, 2);
    const operatoruser = await OperatorUserCreate(
      EmpresaId,
      moduletypeuser.id,
      RFC
    );
    const rolusers = await RolUsersCreate(nameUser, "none", 2);
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


