import { encryptPassword } from "../controllers/userlogin.controller";
import LoginUser from "../database/models/Login.model";

export const createUserInitial = async (req, res) => {
  try {
    const users = await LoginUser.findAll();

    if (users.length > 0) return;

    const password = await encryptPassword("231203crp");
    await LoginUser.create({
      NOMBREUSUARIO: "GL-CRODRIGUEZ",
      NOMBRE: "CRISTOPH",
      APELLIDOS: "RODRIGUEZ PRADO",
      PASS: password,
      EMAIL: "cristoph.2312@gmail.com",
    });
    await LoginUser.create({
      NOMBREUSUARIO: "ADMIN",
      NOMBRE: "ADMIN",
      APELLIDOS: "GL",
      PASS: password,
      EMAIL: "crodriguez@glwinba.com",
    });
  } catch (error) {
    console.log(error);
  }
};
