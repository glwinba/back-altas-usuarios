import transporter from "../config.js";
import fs from "fs";
import handlebars from "handlebars";

const sendMailProveedor = () =>
    new Promise((resolve, reject) => {
        const htmlFile = `${__dirname}/layout_email.html`;
        const htmlSync = fs.readFileSync(htmlFile, { encoding: "utf-8" });
        const template = handlebars.compile(htmlSync);

        const htmlToSend = template();

        let mailOptions = {
            from: 'crodriguez@glwinba.com',
            to: 'rodriguezpradocristoph@gmail.com',
            subject: 'CCOXXO / CONTROL DE EMPRESAS DE SERVICIOS ESPECIALIZADOS',
            html: htmlToSend

        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else resolve(info);
        });
    });


export default sendMailProveedor