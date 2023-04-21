import bcrypt from "bcrypt";
import User from "../database/models/User.model";

export const generatePassword = () => {
  let caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let pass = "";
  let longitud = 10;

  for (let i = 0; i < longitud; i++) {
    pass += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }

  let concatenar = pass.replace(pass[Math.round(Math.random() * 9)], "@");
  return concatenar;
};

export const hashPassword = (password) => {
  const rounds = 8;
  return bcrypt.hashSync(password, rounds);
};

export const changePassword = async (id) => {
  const password = await generatePassword();
  console.log(password)
  const password_hash = await hashPassword(password);

  await User.update(
    {
      PASS: password_hash,
    },
    {
      where: {
        UUID: id,
      },
    }
  );

  return {password: password, password_hash: password_hash}
};
