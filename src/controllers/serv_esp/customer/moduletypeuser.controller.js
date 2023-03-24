import ModuloTipoUsuarioClientes from "../../../database/models/ModuloTipoUsuarioClientes.model";

export const ModuleTypeUserCreate = async (EmpresaUsuarioModuloId) => {
  const moduletypeuser = await ModuloTipoUsuarioClientes.create({
    EmpresaUsuarioModuloId: EmpresaUsuarioModuloId,
    CatalogoTipoUsuarioId: 2,
  });
  return moduletypeuser
};
