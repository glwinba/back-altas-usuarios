import transporter from "../config.js";
import fs from "fs";
import handlebars from "handlebars";
import config from "../../config.js";

const sendMailProveedorConfirmacion = ({
    correo,
    nombre,
    razon_social_contratante,
    correo_contratante,
    abreviacion,
}) =>
  new Promise((resolve, reject) => {
    const htmlFile = `${__dirname}/layout_confirmacion.html`;
    const htmlSync = fs.readFileSync(htmlFile, { encoding: "utf-8" });
    const template = handlebars.compile(htmlSync);
    const replacements = {
      correo,
      nombre,
      razon_social_contratante,
      correo_contratante,
      abreviacion,
    };
    const htmlToSend = template(replacements);

    let mailOptions = {
      from: config.MAIL_USER,
      to: correo_contratante,
      subject: `${abreviacion} / CONFIRMACIÓN ALTA PROVEEDOR`,
      html: htmlToSend,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else resolve(info);
    });
  });

export default sendMailProveedorConfirmacion;
