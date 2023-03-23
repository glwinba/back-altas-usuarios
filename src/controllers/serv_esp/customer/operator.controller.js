import { uuid } from "uuidv4";
import OperadorCliente from "../../../database/models/OperadorCliente.model.js";

export const OperatorCreate = async (RazonSocial, Rfc, EmpresaId) => {
  const operator = await OperadorCliente.create({
    Uuid: uuid(),
    RazonSocial: RazonSocial,
    Rfc: Rfc,
    EmpresaId: EmpresaId,
    CatalogoOperadorId: 1
  });

  return operator
};
