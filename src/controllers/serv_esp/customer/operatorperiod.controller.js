import { uuid } from "uuidv4";
import OperadorPeriodoCliente from "../../../database/models/OperadorPeriodoCliente.model.js";
import { periods } from "../../../datas/createusers.js";

export const OperatorPeriodCreate = async (Mes, Ano, OperadorId) => {
  const operatorperiod = await OperadorPeriodoCliente.create({
    UUID: uuid(),
    Mes: Mes,
    Ano: Ano,
    Activo: 1,
    CargaMaterialidad: 1,
    OperadorId: OperadorId,
  });

  return operatorperiod
};

export const PeriodsCreate = async (OperadorId) => {
    let ArrayIdsOperatorPeriod = [];
  for (let i = 0; i < periods.length; i++) {
    if (periods[i] === periods[0]) {
      for (let j = 10; j <= 12; j++) {
        const operatorperiod = await OperatorPeriodCreate(j, periods[i], OperadorId);
        ArrayIdsOperatorPeriod.push(operatorperiod.id)
      }
    } else {
      for (let j = 1; j <= 12; j++) {
        const operatorperiod = await OperatorPeriodCreate(j, periods[i], OperadorId);
        ArrayIdsOperatorPeriod.push(operatorperiod.id)
      }
    }
  }

  return ArrayIdsOperatorPeriod
};
