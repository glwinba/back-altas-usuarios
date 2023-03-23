import ModuloTipoUsuario from "../../database/models/ModuloTipoUsuario.model";

export const ModuleTypeUserCreate = async (EmpresaUsuarioModuloId) => {
  const moduletypeuser = await ModuloTipoUsuario.create({
    EmpresaUsuarioModuloId: EmpresaUsuarioModuloId,
    CatalogoTipoUsuarioId: 2,
  });
  return moduletypeuser
};
