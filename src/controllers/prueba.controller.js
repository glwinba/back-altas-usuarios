import { Op } from "sequelize";
import Operador from "../database/models/Operador.model";
import OperadorPeriodo from "../database/models/OperadorPeriodo.model";

export const findPeriodos2023 = async (req, res) => {
  const operador = await Operador.findAll({
    attributes: ["id", "RazonSocial", "EmpresaId"],
    where: {
      EmpresaId: {
        [Op.eq]: 439,
      }
    },
  });


  let sin_2023 = [];

  operador.map(async (op) => {
    let find_2023 = [];
    const operadorper = await OperadorPeriodo.findAll({
      where: {
        OperadorId: op.id,
      },
      attributes: ["id", "Ano"],
    });
    operadorper.map((operadorperiodo) => {
      if (operadorperiodo.Ano === 2023) {
        find_2023.push(operadorperiodo);
      }
    });

    if (find_2023.length === 0) {
      sin_2023.push(op);
    }
  });

  try {
    setTimeout(() => {
      res.json(sin_2023);
    }, 60000);
  } catch (error) {
    console.log(error);
  }
};
