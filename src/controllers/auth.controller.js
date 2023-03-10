import LoginUser from "../database/models/Login.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "../config.js"

const comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword)
}

export const signIn = async (req, res) => {
    const userFound = await LoginUser.findOne({
        where: {
            NOMBREUSUARIO: req.body.NOMBREUSUARIO
        }
    })

    if(!userFound) return res.status(400).json({message: "El usuario no fue encontrado"})

    const verifyPassword = await comparePassword(req.body.PASS, userFound.PASS)

    if(!verifyPassword) return res.status(401).json({token: null, message: 'Invalid'})
    
    const token = jwt.sign({id: userFound.id}, config.SECRET, {
        expiresIn: 86400, // 24hrs
    })

    res.json({token})

}