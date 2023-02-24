import Empresa from "../database/models/Empresa.model"

export const allEmpresaSelect = (req, res) => {
    Empresa.findAll({
        attributes: ['id', 'rfc', 'nombre']
    }).then(data => res.json(data));
}

export const allEmpresas = (req, res) => {
    Empresa.findAll({
        attributes: ['id', 'rfc', 'nombre', 'GrupoId'],
        order: [
            ["id", "DESC"]
        ]
    }).then(data => res.json(data));
}

export const createEmpresa = (req, res) => {
    Empresa.create({
        uuid: uuid(),   
        rfc: req.body.rfc,
        nombre: req.body.nombre,
        habilitado: req.body.habilitado,
        activo: req.body.activo,
        GrupoId: req.body.GrupoId
    }).then(empresa => res.json("Empresa creada correctamente."))
}