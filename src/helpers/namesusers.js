export const BuildingNameSupplier = (prefijo, rfc) => {
    return`${prefijo}-${rfc}`;
}

export const BuildingNameCustomer = (prefix,  rfc) => {
    return `C${prefix}-${rfc}`
}

export const BuildingNameAdmin = (prefix, NOMBRE) => {
    let firstName = NOMBRE.split(" ")[0];
    let lastname = NOMBRE.split(" ")[1];
  
    let firstLetter = firstName.split("")[0];
  
    return `${prefix}-${firstLetter}${lastname}`;
}
