import UsuariosRoles from "../../database/models/UsuariosRoles.model";

export const RolUsersCreate = async (UsuarioNombreUsuario, Especial, RoleId) => {
  const rolusers = await UsuariosRoles.create({
    Activo: 1,
    Especial: Especial,
    UsuarioNombreUsuario: UsuarioNombreUsuario,
    RoleId: RoleId,
  });
  return rolusers;
};
