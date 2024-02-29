import { uuid } from "uuidv4";
import CategoriaOperadorCliente from "../../../database/models/CategoriaOperadorCliente.model";
import OperadorPeriodoCliente from "../../../database/models/OperadorPeriodoCliente.model";
import { FindCategoryCompanyById } from "./empresacategoria.controller";
import { CategoryOperatorTypeDocumentCreateComplete } from "./categoryoperatortypedocument.controller";

export const OperatorCategoryCreate = async (
  OperadorPeriodoId,
  EmpresaCategoriumId
) => {
  const operatorcategory = await CategoriaOperadorCliente.create({
    Uuid: uuid(),
    OperadorPeriodoId: OperadorPeriodoId,
    EmpresaCategoriumId: EmpresaCategoriumId,
  });

  return operatorcategory;
};

export const FindCategoryOperatorById = async (id) => {
  const operatorcategory = await CategoriaOperadorCliente.findOne({
    where: {
      id: id,
    },
    include: OperadorPeriodoCliente,
  });
  return operatorcategory;
};

export const OperatorCategoryCreateComplete = async (
  CategoryCompany = [],
  OperatorPeriod = []
) => {
  let operatorcategoryids = [];
  for (const catcompany of CategoryCompany) {
    for (const operatorperiod of OperatorPeriod) {
      const operatorcategory = await OperatorCategoryCreate(
        operatorperiod,
        catcompany.id
      );
      operatorcategoryids.push(operatorcategory.id);
    }
  }
  return operatorcategoryids;
};

export const CreateCategoryAndDocuments = async (req, res) => {
  try {
    const getOperatorPeriods = await OperadorPeriodoCliente.findAll({
      where: {
        OperadorId: req.params.idOperador,
      },
    });

    let operatorPeriods = [];

    for (const operiod of getOperatorPeriods) {
      operatorPeriods.push(operiod.id);
    }

    // const categorycompanies = await FindCategoryCompanyById(req.body.EmpresaId);
    const categorycompanies = [{id: 17},{id: 18},{id: 19},{id: 20}]

    const operatorcategory = await OperatorCategoryCreateComplete(
      categorycompanies,
      operatorPeriods
    );

    const operatorcategorytypedocument =
      await CategoryOperatorTypeDocumentCreateComplete(
        operatorcategory,
        categorycompanies
      );

    res.json("Se agregagrons los nuevos documentos correctamente");
  } catch (error) {
    res.json(`Se produjo un error agregando los documentos: ${error}`);
  }
};
