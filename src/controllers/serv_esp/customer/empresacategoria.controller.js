import { uuid } from "uuidv4";
import EmpresaCategoriaCliente from "../../../database/models/EmpresaCategoriaCliente.model";

export const createEmpresaCategoria = ({}) => {
  EmpresaCategoriaCliente.create({
    Uuid: uuid(),
    HabilitadoCategoriaMaterialidad: 1,
    EmpresaId: req.body.EmpresaId,
    CategoriaMaterialidadId: req.body.CategoriaMaterialidadId
  })
  .then(empresacat => res.json("Empresa Categoria creada"))
  .catch(error => res.json("Error al generar Empresa Categoria"));
};

export const FindCategoryCompanyById = async (EmpresaId) => {
  const categorycompanies = await EmpresaCategoriaCliente.findAll({
    where: {
      EmpresaId: EmpresaId
    },
    attributes: ["id"],
    order: [["id", "ASC"]],
  })

  return categorycompanies
}