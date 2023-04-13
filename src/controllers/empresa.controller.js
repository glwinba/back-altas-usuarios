import Empresa from "../database/models/Empresa.model";
import { uuid } from "uuidv4";
import EmpresaCategoria from "../database/models/EmpresaCategoria.model";
import Grupo from "../database/models/Grupo.model";
import EmpresaCategoriaCliente from "../database/models/EmpresaCategoriaCliente.model";
import CategoriaMaterialidad from "../database/models/CategoriaMaterialidad";

export const allEmpresaSelect = async (req, res) => {
  Empresa.findAll({
    attributes: ["id", "rfc", "nombre"],
  }).then((data) => res.json(data));
};

export const allEmpresas = async (req, res) => {
  Empresa.findAll({
    attributes: ["id", "rfc", "nombre", "GrupoId"],
    order: [["id", "DESC"]],
    include: [
      {
        model: Grupo,
        attributes: ["nombre"],
      },
    ],
  }).then((data) => res.json(data));
};

export const createCompany = async ({}) => {
  Empresa.create({
    uuid: uuid(),
    rfc: req.body.rfc,
    nombre: req.body.nombre,
    ciec: req.body.ciec,
    habilitado: 1,
    activo: 1,
    GrupoId: req.body.GrupoId,
    comentarios: req.body.comentarios,
  })
    .then((empresa) => res.json("Empresa creada correctamente."))
    .catch((error) => res.json("Error al agregar empresa."));
};

export const createCompanyBaja = async (req, res) => {
  Empresa.create({
    uuid: uuid(),
    rfc: req.body.rfc,
    nombre: `${req.body.nombre} BAJA`,
    ciec: req.body.ciec,
    habilitado: 1,
    activo: 1,
    GrupoId: req.body.GrupoId,
    comentarios: "Empresa para Baja",
  })
    .then((empresa) => res.json("Empresa creada correctamente."))
    .catch((error) => res.json("Error al agregar empresa."));
};

export const getCategoryMateriality = async (req, res) => {
  const data = await CategoriaMaterialidad.findAll();
  res.json(data);
};

export const listTypeCompanies = async (req, res) => {
  const companieTypes = [
    {
      id: 1,
      type: "Proveedor",
    },
    {
      id: 2,
      type: "Cliente",
    },
  ];
  res.json(companieTypes)
}

export const createCompanyComplete = async (req, res) => {
  const empresa = await Empresa.create({
    uuid: uuid(),
    rfc: req.body.rfc,
    nombre: req.body.nombre,
    ciec: req.body.ciec ? req.body.ciec : null,
    habilitado: 1,
    activo: 1,
    GrupoId: req.body.GrupoId,
    comentarios: req.body.comentarios ? req.body.comentarios : null,
  });
  if (req.body.bajaCheck) {
    await Empresa.create({
      uuid: uuid(),
      rfc: req.body.rfc,
      nombre: `${req.body.nombre} BAJA`,
      ciec: req.body.ciec ? req.body.ciec : null,
      habilitado: 1,
      activo: 1,
      GrupoId: req.body.GrupoId,
      comentarios: "Empresa para Baja",
    });
  }

  for (const catmat of req.body.categoryMaterialitySelect) {
    for (const companieType of req.body.companieTypesSelect) {
      if (companieType.type === "Proveedor") {
        await EmpresaCategoria.create({
          Uuid: uuid(),
          HabilitadoCategoriaMaterialidad: 1,
          EmpresaId: empresa.dataValues.id,
          CategoriaMaterialidadId: catmat.Id,
        });
        console.log("Se creo la empresa categoria proveedor correctamente")
      } else if (companieType.type === "Cliente") {
        await EmpresaCategoriaCliente.create({
          Uuid: uuid(),
          HabilitadoCategoriaMaterialidad: 1,
          EmpresaId: empresa.dataValues.id,
          CategoriaMaterialidadId: catmat.Id,
        });
        console.log("Se creo la empresa categoria cliente correctamente")
      }
    }
  }
  res.json("Empresa creada correctamente");
};
