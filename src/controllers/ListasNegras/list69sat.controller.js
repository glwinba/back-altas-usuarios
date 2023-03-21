import CatalogoListas69SAT from "../../database/models/ListasNegras/CatalogoListas69SAT.model.js"
import LogLista69SAT from "../../database/models/ListasNegras/LogLista69SAT.model.js";

export const getAllCatalogueList69SAT = async (req, res) => {
    const data = await CatalogoListas69SAT.findAll({
        order: [["id", "DESC"]]
    });
    res.json(data)
}

export const createSupposed = async (req, res) => {
    await CatalogoListas69SAT.create({
        nombreSupuesto: req.body.nombreSupuesto,
        url: req.body.url,
        enable: 1
    })

    res.json("Se creo el nuevo supuesto correctamente")
}

export const historyBlackLists69SAT = async (req, res) => {
    const data = await LogLista69SAT.findAll({
        order: [["id", "DESC"]],
        attributes: ["id", "hash", "CatalogoLista69SATId", "createdAt"],
        include: {
            model: CatalogoListas69SAT,
            attributes: ["id", "nombreSupuesto"]
        }
    })
    res.json(data)
}

export const findUltimateContentDocs = async (req, res) => {
    let data = []
    const docs = await CatalogoListas69SAT.findAll();
    for (const doc of docs) {
        const ultimateModify = await LogLista69SAT.findOne({
            order: [["id", "DESC"]],
        })
        data.push(ultimateModify)
    }
    res.json(data)
}