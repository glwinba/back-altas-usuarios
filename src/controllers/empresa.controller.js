import Empresa from "../database/models/Empresa.model";
import { uuid } from "uuidv4";
import EmpresaCategoria from "../database/models/EmpresaCategoria.model";
import Grupo from "../database/models/Grupo.model";

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
        }]
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

export const createCompanyComplete = async (req, res) => {
  const CategoriaMaterialidadId = [1, 2, 3];
  Empresa.create({
    uuid: uuid(),
    rfc: req.body.rfc,
    nombre: req.body.nombre,
    ciec: req.body.ciec,
    habilitado: 1,
    activo: 1,
    GrupoId: req.body.GrupoId,
    comentarios: req.body.comentarios,
  }).then((empresa) => {
    Empresa.create({
      uuid: uuid(),
      rfc: req.body.rfc,
      nombre: `${req.body.nombre} BAJA`,
      ciec: req.body.ciec,
      habilitado: 1,
      activo: 1,
      GrupoId: req.body.GrupoId,
      comentarios: "Empresa para Baja",
    }).then();

    for (const catmat of CategoriaMaterialidadId) {
      EmpresaCategoria.create({
        Uuid: uuid(),
        HabilitadoCategoriaMaterialidad: 1,
        EmpresaId: empresa.dataValues.id,
        CategoriaMaterialidadId: catmat,
      });
    }
  });

  res.json("Empresa creada correctamente")
};
