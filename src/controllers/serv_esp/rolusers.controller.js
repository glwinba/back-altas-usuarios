import UsuariosRoles from "../../database/models/UsuariosRoles.model";

export const RolUsersCreate = async (nameUser) => {
  const rolusers = await UsuariosRoles.create({
    Activo: 1,
    Especial: "none",
    UsuarioNombreUsuario: nameUser,
    RoleId: 2,
  });
  return rolusers;
};
