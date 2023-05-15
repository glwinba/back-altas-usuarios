import Empresa from "../database/models/Empresa.model";
import { uuid } from "uuidv4";
import EmpresaCategoria from "../database/models/EmpresaCategoria.model";
import Grupo from "../database/models/Grupo.model";
import EmpresaCategoriaCliente from "../database/models/EmpresaCategoriaCliente.model";
import CategoriaMaterialidad from "../database/models/CategoriaMaterialidad";
import xl from "excel4node";
import path from "path";
import fs from "fs";
import { categoryMaterialityIds } from "../datas/createcompany";

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
  const companie = await Empresa.findByPk(req.body.companieSelect);
  const empresa = await Empresa.create({
    uuid: uuid(),
    rfc: companie.rfc,
    nombre: `${companie.nombre} BAJA`,
    ciec: null,
    habilitado: 1,
    activo: 1,
    GrupoId: companie.GrupoId,
    comentarios: "Empresa para Baja",
  })

  res.json(empresa)
};

export const createCategoriesCompanie = async (req, res) => {
  const companie = await Empresa.findByPk(req.body.companieSelect);
  const empresa = await EmpresaCategoria.create({
    Uuid: uuid(),
    HabilitadoCategoriaMaterialidad: 1,
    EmpresaId: companie.id,
    CategoriaMaterialidadId: companie
  })

  res.json(empresa)
};

export const getCategoryMateriality = async (req, res) => {
  const data = await CategoriaMaterialidad.findAll({
    attributes: ["id", "Nombre"],
  });
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
  res.json(companieTypes);
};

export const generateExcel = async (data, grupo) => {
  const dataGroup = await Grupo.findByPk(grupo);
  let wb = new xl.Workbook();

  let ws = wb.addWorksheet("Reporte");
  let cualColumnaEstilo = wb.createStyle({
    font: {
      name: "Calibri",
      color: "#000000",
      size: 12,
    },
    fill: {
      type: "pattern",
      patternType: "solid",
      bgColor: "#7EC4FF",
      fgColor: "#7EC4FF",
    },
    alignment: {
      wrapText: true,
      horizontal: "center",
    },
    border: {
      left: {
        style: "thin",
        color: "#000000",
      },
      right: {
        style: "thin",
        color: "#000000",
      },
      top: {
        style: "thin",
        color: "#000000",
      },
      bottom: {
        style: "thin",
        color: "#000000",
      },
    },
  });

  let contenidoEstilo = wb.createStyle({
    font: {
      name: "Calibri",
      color: "#494949",
      size: 11,
    },
    border: {
      left: {
        style: "thin",
        color: "#000000",
      },
      right: {
        style: "thin",
        color: "#000000",
      },
      top: {
        style: "thin",
        color: "#000000",
      },
      bottom: {
        style: "thin",
        color: "#000000",
      },
    },
  });

  ws.cell(1, 1).string("Id").style(cualColumnaEstilo);
  ws.cell(1, 2).string("Nombre").style(cualColumnaEstilo);
  ws.cell(1, 3).string("Rfc").style(cualColumnaEstilo);
  ws.cell(1, 4).string("Grupo").style(cualColumnaEstilo);

  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    ws.cell(i + 2, 1)
      .string(element.id)
      .style(contenidoEstilo);
    ws.cell(i + 2, 2)
      .string(element.nombre)
      .style(contenidoEstilo);
    ws.cell(i + 2, 3)
      .string(element.rfc)
      .style(contenidoEstilo);
    ws.cell(i + 2, 4)
      .string(dataGroup.nombre)
      .style(contenidoEstilo);
  }

  const pathExcel = path.join(__dirname, "excel", "cristoph.xlsx");
  wb.write(pathExcel);
};

export const createCompanyComplete = async (req, res) => {
  let dataEmpresas = [];
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
  dataEmpresas.push(empresa);
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
  if (req.body.categoryMaterialitySelect.length > 0) {
    for (const catmat of req.body.categoryMaterialitySelect) {
      if (req.body.companieTypesSelect.length > 0) {
        for (const companieType of req.body.companieTypesSelect) {
          if (companieType.type === "Proveedor") {
            await EmpresaCategoria.create({
              Uuid: uuid(),
              HabilitadoCategoriaMaterialidad: 1,
              EmpresaId: empresa.dataValues.id,
              CategoriaMaterialidadId: catmat.id,
            });
          } else if (companieType.type === "Cliente") {
            await EmpresaCategoriaCliente.create({
              Uuid: uuid(),
              HabilitadoCategoriaMaterialidad: 1,
              EmpresaId: empresa.dataValues.id,
              CategoriaMaterialidadId: catmat.id,
            });
          }
        }
      } else {
        await EmpresaCategoria.create({
          Uuid: uuid(),
          HabilitadoCategoriaMaterialidad: 1,
          EmpresaId: empresa.dataValues.id,
          CategoriaMaterialidadId: catmat.id,
        });
      }
    }
  } else {
    for (const catmat of categoryMaterialityIds) {
      if (req.body.companieTypesSelect.length > 0) {
        for (const companieType of req.body.companieTypesSelect) {
          if (companieType.type === "Proveedor") {
            await EmpresaCategoria.create({
              Uuid: uuid(),
              HabilitadoCategoriaMaterialidad: 1,
              EmpresaId: empresa.dataValues.id,
              CategoriaMaterialidadId: catmat,
            });
          } else if (companieType.type === "Cliente") {
            await EmpresaCategoriaCliente.create({
              Uuid: uuid(),
              HabilitadoCategoriaMaterialidad: 1,
              EmpresaId: empresa.dataValues.id,
              CategoriaMaterialidadId: catmat,
            });
          }
        }
      } else {
        await EmpresaCategoria.create({
          Uuid: uuid(),
          HabilitadoCategoriaMaterialidad: 1,
          EmpresaId: empresa.dataValues.id,
          CategoriaMaterialidadId: catmat,
        });
      }
    }
  }
  if (req.body.generateDocument) {
    await generateExcel(dataEmpresas, req.body.GrupoId);
  }
  res.json("Empresa creada correctamente");
};

export const createCompanyCompleteMasive = async (req, res) => {
  let dataEmpresas = [];
  for (const data of req.body.fileData) {
    const empresa = await Empresa.create({
      uuid: uuid(),
      rfc: data.RFC,
      nombre: data.NOMBRE,
      ciec: data.CIEC ? data.CIEC : null,
      habilitado: 1,
      activo: 1,
      GrupoId: req.body.GrupoId,
      comentarios: data.COMENTARIOS ? data.COMENTARIOS : null,
    });
    dataEmpresas.push(empresa);
    if (req.body.bajaCheck) {
      await Empresa.create({
        uuid: uuid(),
        rfc: data.RFC,
        nombre: `${data.NOMBRE} BAJA`,
        ciec: data.CIEC ? data.CIEC : null,
        habilitado: 1,
        activo: 1,
        GrupoId: req.body.GrupoId,
        comentarios: "Empresa para Baja",
      });
    }

    if (req.body.categoryMaterialitySelect.length > 0) {
      for (const catmat of req.body.categoryMaterialitySelect) {
        if (req.body.companieTypesSelect.length > 0) {
          for (const companieType of req.body.companieTypesSelect) {
            if (companieType.type === "Proveedor") {
              await EmpresaCategoria.create({
                Uuid: uuid(),
                HabilitadoCategoriaMaterialidad: 1,
                EmpresaId: empresa.dataValues.id,
                CategoriaMaterialidadId: catmat.id,
              });
            } else if (companieType.type === "Cliente") {
              await EmpresaCategoriaCliente.create({
                Uuid: uuid(),
                HabilitadoCategoriaMaterialidad: 1,
                EmpresaId: empresa.dataValues.id,
                CategoriaMaterialidadId: catmat.id,
              });
            }
          }
        } else {
          await EmpresaCategoria.create({
            Uuid: uuid(),
            HabilitadoCategoriaMaterialidad: 1,
            EmpresaId: empresa.dataValues.id,
            CategoriaMaterialidadId: catmat.id,
          });
        }
      }
    } else {
      for (const catmat of categoryMaterialityIds) {
        if (req.body.companieTypesSelect.length > 0) {
          for (const companieType of req.body.companieTypesSelect) {
            if (companieType.type === "Proveedor") {
              await EmpresaCategoria.create({
                Uuid: uuid(),
                HabilitadoCategoriaMaterialidad: 1,
                EmpresaId: empresa.dataValues.id,
                CategoriaMaterialidadId: catmat,
              });
            } else if (companieType.type === "Cliente") {
              await EmpresaCategoriaCliente.create({
                Uuid: uuid(),
                HabilitadoCategoriaMaterialidad: 1,
                EmpresaId: empresa.dataValues.id,
                CategoriaMaterialidadId: catmat,
              });
            }
          }
        } else {
          await EmpresaCategoria.create({
            Uuid: uuid(),
            HabilitadoCategoriaMaterialidad: 1,
            EmpresaId: empresa.dataValues.id,
            CategoriaMaterialidadId: catmat,
          });
        }
      }
    }

    console.log("Se creo la empresa");
  }

  if (req.body.generateDocument) {
    await generateExcel(dataEmpresas, req.body.GrupoId);
  }
  res.json("Empresa creada correctamente");
};

