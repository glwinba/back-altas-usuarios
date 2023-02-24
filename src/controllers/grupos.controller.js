import { uuid } from "uuidv4";
import Grupo from "../database/models/Grupo.model";

export const getGrupos = async (req, res) => {
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
    codigo: req.body.codigo,
    habilitado: req.body.habilitado,
    activo: req.body.activo,
    comentarios: req.body.comentarios,
  }).then((grupo) => res.json("Grupo creado correctamente."));
};
