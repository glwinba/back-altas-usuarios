import { getConnection, sql } from "../database/connection.js";
import bcrypt from "bcrypt";

const encryPassword = (password, rounds = 8) => {
    return bcrypt.hashSync(password, rounds);
}

export const changePassword = async (req, res) => {

    const { id } = req.body;
    var { password } = req.body;

    var password_hash = encryPassword(password);
    const pool = await getConnection();

    await pool.request().input('id', sql.Int, id)
                        .input('password', sql.NVarChar, password_hash)
                        .query('UPDATE PORTAL.dbo.USUARIO SET PASS = @password WHERE UUID = @id');

    
    res.json('Clave cambiada correctamente');
}

