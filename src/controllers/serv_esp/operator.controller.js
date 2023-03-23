import { uuid } from "uuidv4";
import Operador from "../../database/models/Operador.model.js";

export const OperatorCreate = async (RazonSocial, Rfc, EmpresaId, AreaServicio) => {
  const operator = await Operador.create({
    Uuid: uuid(),
    RazonSocial: RazonSocial,
    Rfc: Rfc,
    EmpresaId: EmpresaId,
    CatalogoOperadorId: 1,
    AreaServicio: AreaServicio,
  });

  return operator
};
