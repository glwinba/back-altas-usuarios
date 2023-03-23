import Accesos from "../../database/models/Accesos.model";
import { idPermission } from "../../datas/createusers";

export const UserAccessCreate = async (UsuariosRoleId, PermisoId) => {
  const useraccess = await Accesos.create({
    UsuariosRoleId: UsuariosRoleId,
    PermisoId: PermisoId,
    Activo: 1,
  });
  return useraccess;
};

export const UserAccessCreateComplete = async (UsuariosRoleId) => {
    for (const permission of idPermission) {
        await UserAccessCreate(UsuariosRoleId, permission)
    }
  return console.log("Proceso de insersion completo");
};
