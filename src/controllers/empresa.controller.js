import Empresa from "../database/models/Empresa.model"

export const allEmpresaSelect = (req, res) => {
    Empresa.findAll({
        attributes: ['id', 'rfc', 'nombre']
    }).then(data => res.json(data));
}