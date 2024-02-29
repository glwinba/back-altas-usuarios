import { uuid } from "uuidv4";
import CategoriaOperadorTipoDocumento from "../../database/models/CategoriaOperadorTipoDocumento.model";
import {
  DUE_DILLIGENCE,
  REGISTRO_CONTROL,
  REGISTRO_CONTROL2,
  ENTREGABLES,
  DICTAMEN_IMSS,
} from "../../datas/createusers.js";
import { FindCategoryOperatorById } from "./operatorcategory.controller";
import OperadorPeriodo from "../../database/models/OperadorPeriodo.model";
import CategoriaOperador from "../../database/models/CategoriaOperador.model";
import { Op } from "sequelize";

export const CategoryOperatorTypeDocumentCreate = async (
  CategoriaOperadorId,
  CatalogoTipoDocumentoId
) => {
  const catopptypedocument = await CategoriaOperadorTipoDocumento.create({
    Uuid: uuid(),
    RequireValidacion: 0,
    HabilitadoDocumento: 1,
    CategoriaOperadorId: CategoriaOperadorId,
    CatalogoTipoDocumentoId: CatalogoTipoDocumentoId,
  });

  return catopptypedocument;
};

export const CategoryOperatorTypeDocumentCreateComplete = async (
  operatorcategory = [],
  categorycompany = []
) => {
  for (const operatorcat of operatorcategory) {
    const opcat = await FindCategoryOperatorById(operatorcat);
    if (opcat.EmpresaCategoriumId === categorycompany[0].id) {
      for (let i = 0; i < DUE_DILLIGENCE.length; i++) {
        await CategoryOperatorTypeDocumentCreate(opcat.id, DUE_DILLIGENCE[i]);
      }
    } else if (opcat.EmpresaCategoriumId === categorycompany[1].id) {
      if (opcat.OperadorPeriodo.Ano === 2023) {
        for (let i = 0; i < REGISTRO_CONTROL2.length; i++) {
          await CategoryOperatorTypeDocumentCreate(
            opcat.id,
            REGISTRO_CONTROL2[i]
          );
        }
      } else if (
        opcat.OperadorPeriodo.Ano === 2022 &&
        opcat.OperadorPeriodo.Mes === 12
      ) {
        for (let i = 0; i < REGISTRO_CONTROL2.length; i++) {
          await CategoryOperatorTypeDocumentCreate(
            opcat.id,
            REGISTRO_CONTROL2[i]
          );
        }
      } else {
        for (let i = 0; i < REGISTRO_CONTROL.length; i++) {
          await CategoryOperatorTypeDocumentCreate(
            opcat.id,
            REGISTRO_CONTROL[i]
          );
        }
      }
    } else if (opcat.EmpresaCategoriumId === categorycompany[2].id) {
      for (let i = 0; i < ENTREGABLES.length; i++) {
        await CategoryOperatorTypeDocumentCreate(opcat.id, ENTREGABLES[i]);
      }
    }
  }
};

export const addDocuments = async (req, res) => {
  for (const Operador of req.body.OperadorId) {
    let periodsId = [];

    const periods = await OperadorPeriodo.findAll({
      where: {
        OperadorId: Operador,
      },
    });

    for (const period of periods) {
      periodsId.push(period.id);
    }

    let idsoperatorcategory = [];

    const statusDictamenImss = await CategoriaOperador.findAll({
      where: {
        OperadorPeriodoId: { [Op.in]: periodsId },
        [Op.and]: {
          EmpresaCategoriumId: 352,
        },
      },
    });

    if (statusDictamenImss.length > 0) {
      console.log(
        `Ya se agregaron los documentos anteriormente del Operador ${Operador} y tiene ${statusDictamenImss.length} periodos con esa catgeoria`
      );
    } else {
      for (const period of periods) {
        const operatorcategory = await CategoriaOperador.create({
          Uuid: uuid(),
          OperadorPeriodoId: period.id,
          EmpresaCategoriumId: 352,
        });

        idsoperatorcategory.push(operatorcategory.id);
      }

      for (const id of idsoperatorcategory) {
        for (let i = 0; i < DICTAMEN_IMSS.length; i++) {
          await CategoryOperatorTypeDocumentCreate(id, DICTAMEN_IMSS[i]);
        }
      }
    }
  }
  console.log("Documentos agregados correctamente");
};
