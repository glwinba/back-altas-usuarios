import { uuid } from "uuidv4";
import {
  DUE_DILLIGENCE,
  REGISTRO_CONTROL,
  REGISTRO_CONTROL2,
  ENTREGABLES,
} from "../../../datas/createusers.js";
import { FindCategoryOperatorById } from "./operatorcategory.controller";
import CategoriaOperadorTipoDocumentoCliente from "../../../database/models/CategoriaOperadorTipoDocumentoCliente.model";

export const CategoryOperatorTypeDocumentCreate = async (
  CategoriaOperadorId,
  CatalogoTipoDocumentoId
) => {
  const catopptypedocument = await CategoriaOperadorTipoDocumentoCliente.create({
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
