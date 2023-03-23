import { BuildingNameCustomer } from "../../../helpers/namesusers";
import { generatePassword, hashPassword } from "../../../helpers/passwords";
import { UserCreate } from "../../user.controller";
import { FindCategoryCompanyById } from "./empresacategoria.controller";
import { OperatorCreate } from "./operator.controller";
import { OperatorCategoryCreateComplete } from "./operatorcategory.controller";
import { PeriodsCreate } from "./operatorperiod.controller";

export const CreateUserClienteIndividual = async (
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
        nameUser
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
      }
  
      return console.log("Se creo el usuario correctamente");
    } catch (error) {
      return console.log(error);
    }
  };
  
  export const CreateUserClienteMasive = async (EmpresaId, DataExcel, sendMail) => {
    try {
      // Creando el usuario de manera masiva.
      for (const data of DataExcel) {
        await CreateUserClienteIndividual(
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
  
  export const CreateUserCliente = async (req, res) => {
    try {
      if (req.body.dataExcel) {
        await CreateUserClienteMasive(
          req.body.EmpresaId,
          req.body.dataExcel,
          req.body.sendMail
        );
      } else {
        await CreateUserClienteIndividual(
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