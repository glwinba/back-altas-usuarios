import ModuloTipoUsuario from "../../database/models/ModuloTipoUsuario.model";

export const ModuleTypeUserCreate = async (EmpresaUsuarioModuloId, CatalogoTipoUsuarioId) => {
  const moduletypeuser = await ModuloTipoUsuario.create({
    EmpresaUsuarioModuloId: EmpresaUsuarioModuloId,
    CatalogoTipoUsuarioId: CatalogoTipoUsuarioId,
  });
  return moduletypeuser
};
