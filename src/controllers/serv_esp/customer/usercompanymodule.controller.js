import EmpresaUsuariosModulo from "../../database/models/EmpresaUsuarioModulo.model";

export const UserCompanyModuleCreate = async (EmpresaId, nameUser) => {
  const companyusermodule = await EmpresaUsuariosModulo.create({
    EmpresaId: EmpresaId,
    UsuarioNombreUsuario: nameUser,
    CatalogoModuloId: 5,
  });

  return companyusermodule
};
