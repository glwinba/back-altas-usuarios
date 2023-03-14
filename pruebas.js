const prefixempresas = [
  {
    UUID: 439,
    prefix: "CCO",
    abbreviation: "CCOXXO",
  },
  {
    UUID: 442,
    prefix: "OG",
    abbreviation: "OXXOGAS",
  },
  {
    UUID: 869,
    prefix: "IMMEX",
    abbreviation: "IMMEX",
  },
  {
    UUID: 871,
    prefix: "XP",
    abbreviation: "XPERTAL",
  },
  {
    UUID: 881,
    prefix: "FS",
    abbreviation: "FEMSA SERVICIOS",
  },
  {
    UUID: 909,
    prefix: "EX",
    abbreviation: "EMPREX SERVICIOS",
  },
  {
    UUID: 905,
    prefix: "ABC",
    abbreviation: "ABC TECH",
  },
  {
    UUID: 898,
    prefix: "DVCM",
    abbreviation: "DVCM",
  },
  {
    UUID: 868,
    prefix: "FAR",
    abbreviation: "FARMACON",
  },
];

const getPrefixNameUser = (NOMBREUSUARIO) => {
  return NOMBREUSUARIO.split("-")[0];
};

const getAbbreviationByPrefix = async (NOMBREUSUARIO) => {
  let abbreviation;
  const prefix = await getPrefixNameUser(NOMBREUSUARIO);

  prefixempresas.forEach((pfEmp) => {
    if (prefix === pfEmp.prefix) {
      abbreviation = pfEmp.abbreviation;
    }
  });



  return console.log(abbreviation);
};

getAbbreviationByPrefix("CCO-ROPC03123KKI");
