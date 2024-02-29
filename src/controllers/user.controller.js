import { Op } from "sequelize";
import Operador from "../database/models/Operador.model.js";
import User from "../database/models/User.model.js";
import UsuarioOperador from "../database/models/UsuarioOperador.model.js";
import EmpresaUsuariosModulo from "../database/models/EmpresaUsuarioModulo.model.js";
import Empresa from "../database/models/Empresa.model.js";
import sendMailProveedor from "../mails/proveedor/controldeempresa.js";
import { changePassword } from "../helpers/passwords.js";
import { getAbbreviationByPrefix } from "../helpers/prefix.js";
import sendMailProveedorLaureate from "../mails/proveedor/maillaureate.js";

export const getUsers = async (req, res) => {
  const type_users = ["admin", "cliente", "proveedor"];
  User.findAll({
    attributes: ["UUID", "NOMBREUSUARIO", "NOMBRE", "EMAIL"],
    order: [["UUID", "DESC"]],
  }).then((usuario) => {
    res.json(usuario);
  });
};

export const getUserEmpresas = async (req, res) => {
  const user = await User.findByPk(req.params.id);

  EmpresaUsuariosModulo.findAll({
    where: {
      UsuarioNombreUsuario: user.NOMBREUSUARIO,
    },
    include: [Empresa],
  }).then((result) => {
    res.json(result);
  });
};

export const getUser = async (req, res) => {
  User.findByPk(req.params.id).then((result) => {
    res.json(result);
  });
};

export const updatePassword = async (req, res) => {
  const user = await User.findByPk(req.params.id);

  const changePass = await changePassword(req.params.id);
  const abbreviation = await getAbbreviationByPrefix(user.NOMBREUSUARIO);

  await sendMailProveedor({
    razon_social: user.NOMBRE,
    correo: user.EMAIL,
    usuario: user.NOMBREUSUARIO,
    clave: changePass.password,
    abreviacion: abbreviation,
  });

  res.json("Usuario actualizado correctamente.");
};

export const updateRFCInternal = async (req, res) => {
  var operador = await Operador.findByPk(req.params.id, {
    attributes: ["id", "Rfc", "EmpresaId"],
  });

  await Operador.update(
    {
      Rfc: req.body.Rfc,
    },
    {
      where: {
        id: operador.id,
      },
    }
  ).then((result) => {
    console.log(`Se actualizo ${result[0]} columna(s) de la tabla Operador`);
  });

  await UsuarioOperador.update(
    {
      Rfc: req.body.Rfc,
    },
    {
      where: {
        EmpresaId: operador.EmpresaId,
        Rfc: {
          [Op.like]: `%${operador.Rfc}%`,
        },
      },
    }
  ).then((result) => {
    console.log(
      `Se actualizo ${result[0]} columna(s) de la tabla UsuarioOperador`
    );
  });

  res.json("Se actualizo correctamente");
};

export const updateEmail = async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) return res.json("Usuario no encontrado");

  const changePass = await changePassword(req.params.id);
  const abbreviation = await getAbbreviationByPrefix(user.NOMBREUSUARIO);

  await User.update(
    {
      EMAIL: req.body.EMAIL,
    },
    {
      where: {
        UUID: req.params.id,
      },
    }
  );

  await sendMailProveedor({
    razon_social: user.NOMBRE,
    correo: req.body.EMAIL,
    usuario: user.NOMBREUSUARIO,
    clave: changePass.password,
    abreviacion: abbreviation,
  });

  res.json("Usuario actualizado correctamente.");
};

export const UserCreate = async (NOMBREUSUARIO, PASS, NOMBRE, EMAIL, ROL) => {
  const user = await User.create({
    NOMBREUSUARIO: NOMBREUSUARIO,
    PASS: PASS,
    IDROL: ROL,
    NOMBRE: NOMBRE,
    EMAIL: EMAIL,
    HABILITADO: 1,
  });

  return user;
};

export const sendAccessMasive = async (req, res) => {
  const users = await User.findAll({
    where: {
      IDROL: 2074,
      NOMBREUSUARIO: {
        [Op.like]: `%GS-%`,
      }
    }
  })
  for (const user of users) {
    const changePass = await changePassword(user.UUID);
    const abbreviation = await getAbbreviationByPrefix(user.NOMBREUSUARIO);

    await sendMailProveedor({
      razon_social: user.NOMBRE,
      correo: user.EMAIL,
      usuario: user.NOMBREUSUARIO,
      clave: changePass.password,
      abreviacion: abbreviation,
    });
    console.log(`Accesos enviados de: ${user.NOMBREUSUARIO}`)
  }
  res.json(`Todos los accesos fueron enviados correctamente. Total:${users.length}`);
};
