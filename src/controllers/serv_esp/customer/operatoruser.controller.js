import UsuarioOperadorClientes from "../../../database/models/UsuarioOperadorClientes.model";

export const OperatorUserCreate = async (
  EmpresaId,
  ModuloTipoUsuarioId,
  Rfc
) => {
  const operatoruser = await UsuarioOperadorClientes.create({
    EmpresaId: EmpresaId,
    Rfc: Rfc,
    ModuloTipoUsuarioId: ModuloTipoUsuarioId,
  });
  return operatoruser;
};
