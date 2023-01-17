import bcrypt from "bcrypt";
import User from "../database/models/User.models";

// Hash password
const encryPassword = (password, rounds = 8) => {
    return bcrypt.hashSync(password, rounds);
}

export const changePassword = async (req, res) => {

    const password_hash = encryPassword(req.body.password);
    User.update({
        PASS: password_hash
    }, {
        where: {
            UUID: req.params.id
        }
    }).then((user) =>{
        res.json('Clave cambiada correctamente');
    })
}

