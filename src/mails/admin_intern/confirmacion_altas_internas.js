import transporter from "../config.js";
import fs from "fs";
import handlebars from "handlebars";
import config from "../../config.js";

const sendMailAdministradorInternoConfirmacion = ({
    correo,
    nombre,
    nombreusuario,
    password,
}) =>
  new Promise((resolve, reject) => {
    const htmlFile = `${__dirname}/layout_confirmacion.html`;
    const htmlSync = fs.readFileSync(htmlFile, { encoding: "utf-8" });
    const template = handlebars.compile(htmlSync);
    const replacements = {
      correo,
      nombre,
      nombreusuario,
      password
    };
    const htmlToSend = template(replacements);

    let mailOptions = {
      from: config.MAIL_USER,
      to: correo,
      subject: `CESE / USUARIO PLATAFORMA`,
      html: htmlToSend,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else resolve(info);
    });
  });

export default sendMailAdministradorInternoConfirmacion;
