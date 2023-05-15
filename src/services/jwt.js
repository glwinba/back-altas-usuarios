import jwt from "jwt-simple";
import moment from "moment";

export const secret = "CLAVE_SECRETA_PARA_LOGIN_WINBA_ADMIN_202323"

export const createToken = (user) => {
    const payload = {
        id: user.id,
        user: user.NOMBREUSUARIO,
        nombre: user.NOMBRE,
        apellidos: user.APELLIDOS,
        email: user.EMAIL,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    }

    return jwt.encode(payload, secret)
}



