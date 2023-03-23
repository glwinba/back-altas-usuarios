import { uuid } from "uuidv4";
import CategoriaOperador from "../../database/models/CategoriaOperador.model";
import OperadorPeriodo from "../../database/models/OperadorPeriodo.model";

export const OperatorCategoryCreate = async (OperadorPeriodoId, EmpresaCategoriumId) => {
  const operatorcategory = await CategoriaOperador.create({
    Uuid: uuid(),
    OperadorPeriodoId: OperadorPeriodoId,
    EmpresaCategoriumId: EmpresaCategoriumId,
  });

  return operatorcategory
};

export const FindCategoryOperatorById = async (id) => {
  const operatorcategory = await CategoriaOperador.findOne({
    where: {
      id: id
    },
    include: OperadorPeriodo
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

