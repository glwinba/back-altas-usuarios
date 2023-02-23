import Grupo from "../database/models/Grupo.model"

export const getGrupos = async (req, res) => {
    Grupo.findAll({
        attributes: ["id","nombre", "comentarios"],
        order: [
            ["id", "DESC"]
        ]
    }).then((grupo) => {
        res.json(grupo);
    })
}