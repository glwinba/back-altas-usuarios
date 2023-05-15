import { uuid } from "uuidv4";
import Operador from "../../database/models/Operador.model.js";
import { FindCategoryCompanyById } from "../empresacategoria.controller.js";
import { CategoryOperatorTypeDocumentCreateComplete } from "./categoryoperatortypedocument.controller.js";
import { ModuleTypeUserCreate } from "./moduletypeuser.controller.js";
import { OperatorCategoryCreateComplete } from "./operatorcategory.controller.js";
import { PeriodsCreate } from "./operatorperiod.controller.js";
import { OperatorUserCreate } from "./operatoruser.controller.js";
import { RolUsersCreate } from "./rolusers.controller.js";
import { UserAccessCreateComplete } from "./useraccess.controller.js";
import { UserCompanyModuleCreate } from "./usercompanymodule.controller.js";

export const OperatorCreate = async (
  RazonSocial,
  Rfc,
  EmpresaId,
  AreaServicio
) => {
  const operator = await Operador.create({
    Uuid: uuid(),
    RazonSocial: RazonSocial,
    Rfc: Rfc,
    EmpresaId: EmpresaId,
    CatalogoOperadorId: 1,
    AreaServicio: AreaServicio,
  });

  return operator;
};

export const CreateOperatoByUserProveedor = async (req, res) => {
  try {
    const user = req.body.usuario;
    const RFC = user.NOMBREUSUARIO.split("-")[1];
    for (const Empresa of req.body.EmpresaId) {
      const EmpresaId = parseInt(Empresa.id) 
      const operator = await OperatorCreate(
        user.NOMBRE,
        RFC,
        EmpresaId,
        null
      );
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
        user.NOMBREUSUARIO,
        5
      );
      const moduletypeuser = await ModuleTypeUserCreate(
        usercompanymodule.id,
        2
      );
      const operatoruser = await OperatorUserCreate(
        EmpresaId,
        moduletypeuser.id,
        RFC
      );
    
      console.log("Se creo la empresa correctamente");
    }

    res.json("Empresas Agregadas correectamente");
  } catch (error) {
    console.log(error);
    res.json("Error");
  }
};
