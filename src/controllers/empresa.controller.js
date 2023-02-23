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