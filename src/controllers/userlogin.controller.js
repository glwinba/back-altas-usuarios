import LoginUser from "../database/models/Login.model";
import bcrypt from "bcrypt";

export const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const createUserLogin = async (req, res) => {
  const password = await encryptPassword(req.body.PASS);

  LoginUser.create({
    NOMBREUSUARIO: req.body.NOMBREUSUARIO,
    NOMBRE: req.body.NOMBRE,
    APELLIDOS: req.body.APELLIDOS,
    PASS: password,
    EMAIL: req.body.EMAIL,
  }).then((login) => {
    res.json("El usuario fue creado correctamente");
  });
};
