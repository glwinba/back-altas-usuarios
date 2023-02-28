import { uuid } from "uuidv4";
import EmpresaCategoria from "../database/models/EmpresaCategoria.model";

export const createEmpresaCategoria = ({}) => {
  EmpresaCategoria.create({
    Uuid: uuid(),
    HabilitadoCategoriaMaterialidad: 1,
    EmpresaId: req.body.EmpresaId,
    CategoriaMaterialidadId: req.body.CategoriaMaterialidadId
  })
  .then(empresacat => res.json("Empresa Categoria creada"))
  .catch(error => res.json("Error al generar Empresa Categoria"));
};
