import transporter from "../config.js";
import fs from "fs";
import handlebars from "handlebars";
import config from "../../config.js";

const sendMailAdministradorConfirmacion = ({
    correo,
    nombre,
    nombreusuario,
    password,
    abreviacion,
}) =>
  new Promise((resolve, reject) => {
    const htmlFile = `${__dirname}/layout_confirmacion.html`;
    const htmlSync = fs.readFileSync(htmlFile, { encoding: "utf-8" });
    const template = handlebars.compile(htmlSync);
    const replacements = {
      correo,
      nombre,
      nombreusuario,
      password,
      abreviacion,
    };
    const htmlToSend = template(replacements);

    let mailOptions = {
      from: config.MAIL_USER,
      to: correo,
      subject: `${abreviacion} / CONTROL DE EMPRESAS DE SERVICIOS ESPECIALIZADOS`,
      html: htmlToSend,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else resolve(info);
    });
  });

export default sendMailAdministradorConfirmacion;
