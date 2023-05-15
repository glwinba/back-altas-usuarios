import LoginUser from "../database/models/Login.model.js";
import bcrypt from "bcrypt";
import { createToken } from "../services/jwt.js";

export const login = (req, res) => {
  let params = req.body;
  if (!params.NOMBREUSUARIO || !params.PASS) {
    return res.status(400).send({
      status: "error",
      message: "Faltan datos por enviar.",
    });
  }

  LoginUser.findOne({
    where: {
      NOMBREUSUARIO: req.body.NOMBREUSUARIO,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          status: "error",
          message: "No existe el usuario.",
        });
      }

      const pwd = bcrypt.compareSync(params.PASS, user.PASS);

      if (!pwd) {
        return res.status(400).send({
          status: "error",
          message: "No te has identificado correctamente.",
        });
      }

      const token = createToken(user);
      return res.status(200).send({
        status: "succes",
        message: "Te has identificado correctamente",
        user: {
          id: user.id,
          user: user.NOMBREUSUARIO,
          nombre: user.NOMBRE,
          apellidos: user.APELLIDOS,
        },
        token,
      });
    })
    .catch((error) => {
      return res.status(400).send({
        status: "error",
        message: "No existe el usuario",
        error: error,
      });
    });
};
