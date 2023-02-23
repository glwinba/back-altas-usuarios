import transporter from "../config.js";
import fs from "fs";
import handlebars from "handlebars";

const sendMailProveedorConfirmacion = ({
    razon_social,
    correo, 
    usuario,
    clave,
    abreviacion
}) =>
    new Promise((resolve, reject) => {
        const htmlFile = `${__dirname}/layout_confirmacion.html`;
        const htmlSync = fs.readFileSync(htmlFile, { encoding: "utf-8" });
        const template = handlebars.compile(htmlSync);
        const replacements = {
            razon_social,
            correo, 
            usuario,
            clave,
            abreviacion
        };
        const htmlToSend = template(replacements);

        let mailOptions = {
            from: 'crodriguez@glwinba.com',
            to: correo,
            subject: `${abreviacion} / CONFIRMACIÓN ALTA PROVEEDOR`,
            html: htmlToSend

        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else resolve(info);
        });
    });


export default sendMailProveedorConfirmacion