import UsuariosRolesClientes from "../../../database/models/UsuariosRolesClientes.model";

export const RolUsersCreate = async (nameUser) => {
  const rolusers = await UsuariosRolesClientes.create({
    Activo: 1,
    Especial: "none",
    UsuarioNombreUsuario: nameUser,
    RoleId: 2,
  });
  return rolusers;
};
