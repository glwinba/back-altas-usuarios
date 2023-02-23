import Empresa from "./models/Empresa.model";
import EmpresaUsuariosModulo from "./models/EmpresaUsuarioModulo.model";
import ModuloTipoUsuario from "./models/ModuloTipoUsuario.model";

EmpresaUsuariosModulo.hasOne(ModuloTipoUsuario, { foreignKey: 'EmpresaUsuarioModuloId' });
ModuloTipoUsuario.belongsTo(EmpresaUsuariosModulo, { foreignKey: 'EmpresaUsuarioModuloId' });

Empresa.hasOne(EmpresaUsuariosModulo, { foreignKey: 'EmpresaId' });
EmpresaUsuariosModulo.belongsTo(Empresa, { foreignKey: 'EmpresaId' });
