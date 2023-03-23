import { uuid } from "uuidv4";
import CategoriaOperadorCliente from "../../../database/models/CategoriaOperadorCliente.model";
import OperadorPeriodoCliente from "../../../database/models/OperadorPeriodoCliente.model";

export const OperatorCategoryCreate = async (OperadorPeriodoId, EmpresaCategoriumId) => {
  const operatorcategory = await CategoriaOperadorCliente.create({
    Uuid: uuid(),
    OperadorPeriodoId: OperadorPeriodoId,
    EmpresaCategoriumId: EmpresaCategoriumId,
  });

  return operatorcategory
};

export const FindCategoryOperatorById = async (id) => {
  const operatorcategory = await CategoriaOperadorCliente.findOne({
    where: {
      id: id
    },
    include: OperadorPeriodoCliente
  });
  return operatorcategory
}

export const OperatorCategoryCreateComplete = async (CategoryCompany = [], OperatorPeriod = []) => {
    let operatorcategoryids = [];
    for (const catcompany of CategoryCompany) {
        for (const operatorperiod of OperatorPeriod) {
            const operatorcategory = await OperatorCategoryCreate(operatorperiod, catcompany.id)
            operatorcategoryids.push(operatorcategory.id);
        }
    }
    return operatorcategoryids
}

