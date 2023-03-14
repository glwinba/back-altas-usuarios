import prefixempresas from "../arreglos/prefixempresas.js";

export const findExtraData = (EmpresaId) => {
  let prefix;
  let abbreviation;

  prefixempresas.forEach((pfEmp) => {
    if (EmpresaId === pfEmp.UUID) {
      prefix = pfEmp.prefix;
      abbreviation = pfEmp.abbreviation;
    }
  });

  return { prefix: prefix, abbreviation: abbreviation };
};

export const getPrefixNameUser = (NOMBREUSUARIO) => {
  return NOMBREUSUARIO.split("-")[0];
};

export const getAbbreviationByPrefix = (NOMBREUSUARIO) => {
  let abbreviation;
  const prefix = getPrefixNameUser(NOMBREUSUARIO);

  prefixempresas.forEach((pfEmp) => {
    if (prefix === pfEmp.prefix) {
      abbreviation = pfEmp.abbreviation;
    }
  });

  return abbreviation
};


