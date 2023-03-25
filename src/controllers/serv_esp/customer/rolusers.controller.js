import UsuariosRolesClientes from "../../../database/models/UsuariosRolesClientes.model";

export const RolUsersCreate = async (UsuarioNombreUsuario) => {
  const rolusers = await UsuariosRolesClientes.create({
    Activo: 1,
    Especial: "none",
    UsuarioNombreUsuario: UsuarioNombreUsuario,
    RoleId: 2,
  });
  return rolusers;
};
