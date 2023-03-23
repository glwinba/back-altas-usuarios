import UsuarioOperador from "../../database/models/UsuarioOperador.model";

export const OperatorUserCreate = async (
  EmpresaId,
  ModuloTipoUsuarioId,
  Rfc
) => {
  const operatoruser = await UsuarioOperador.create({
    EmpresaId: EmpresaId,
    Rfc: Rfc,
    ModuloTipoUsuarioId: ModuloTipoUsuarioId,
  });
  return operatoruser;
};
