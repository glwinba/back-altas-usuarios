import { uuid } from "uuidv4";
import Grupo from "../database/models/Grupo.model";

export const getGrupos = async (req, res) => {
  const types_calls =  ['main', 'select'];
  Grupo.findAll({
    attributes: ["id", "nombre", "comentarios"],
    order: [["id", "DESC"]],
  }).then((grupo) => {
    res.json(grupo);
  });
};

export const createGrupos = async (req, res) => {
  Grupo.create({
    uuid: uuid(),
    nombre: req.body.nombre,
    codigo: req.body.nombre,
    habilitado: 1,
    activo: 1,
    comentarios: req.body.comentarios ? req.body.comentarios : null,
  }).then((grupo) => res.json("Grupo creado correctamente."));
};
