import transporter from "../config.js";
import fs from "fs";
import handlebars from "handlebars";
import config from "../../config.js";

const sendMailProveedorLaureate = ({
    razon_social,
    correo, 
    usuario,
    clave,
    mailcc
}) =>
    new Promise((resolve, reject) => {
        const htmlFile = `${__dirname}/layout_laureate.html`;
        const htmlSync = fs.readFileSync(htmlFile, { encoding: "utf-8" });
        const template = handlebars.compile(htmlSync);
        const replacements = {
            razon_social,
            correo, 
            usuario,
            clave
        };
        const htmlToSend = template(replacements);

        let mailOptions = {
            from: config.MAIL_USER,
            to: correo,
            subject: `LAUREATE / CONTROL DE EMPRESAS DE SERVICIOS ESPECIALIZADOS`,
            html: htmlToSend,
            cc: mailcc
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else resolve(info);
        });
    });


export default sendMailProveedorLaureate