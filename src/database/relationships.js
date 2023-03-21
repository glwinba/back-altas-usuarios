import Empresa from "./models/Empresa.model";
import EmpresaUsuariosModulo from "./models/EmpresaUsuarioModulo.model";
import Grupo from "./models/Grupo.model";
import CatalogoListas56SAT from "./models/ListasNegras/CatalogoListas69SAT.model";
import LogLista69SAT from "./models/ListasNegras/LogLista69SAT.model";
import ModuloTipoUsuario from "./models/ModuloTipoUsuario.model";
import Operador from "./models/Operador.model";
import OperadorPeriodo from "./models/OperadorPeriodo.model";

EmpresaUsuariosModulo.hasOne(ModuloTipoUsuario, { foreignKey: 'EmpresaUsuarioModuloId' });
ModuloTipoUsuario.belongsTo(EmpresaUsuariosModulo, { foreignKey: 'EmpresaUsuarioModuloId' });

Empresa.hasOne(EmpresaUsuariosModulo, { foreignKey: 'EmpresaId' });
EmpresaUsuariosModulo.belongsTo(Empresa, { foreignKey: 'EmpresaId' });


Grupo.hasOne(Empresa, {foreignKey: 'GrupoId'});
Empresa.belongsTo(Grupo, {foreignKey: 'GrupoId'});

Operador.hasMany(OperadorPeriodo, {foreignKey: 'OperadorId'});
OperadorPeriodo.belongsTo(Operador, {foreignKey: 'OperadorId'});

CatalogoListas56SAT.hasOne(LogLista69SAT, {foreignKey: 'CatalogoLista69SATId'});
LogLista69SAT.belongsTo(CatalogoListas56SAT, {foreignKey: 'CatalogoLista69SATId'});