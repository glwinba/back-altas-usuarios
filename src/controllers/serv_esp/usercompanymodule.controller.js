import EmpresaUsuariosModulo from "../../database/models/EmpresaUsuarioModulo.model";

export const UserCompanyModuleCreate = async (EmpresaId, nameUser, CatalogoModuloId) => {
  const companyusermodule = await EmpresaUsuariosModulo.create({
    EmpresaId: EmpresaId,
    UsuarioNombreUsuario: nameUser,
    CatalogoModuloId: CatalogoModuloId,
  });

  return companyusermodule
};
