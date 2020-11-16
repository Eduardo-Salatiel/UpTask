const nodemailer = require("nodemailer");
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");
const util = require("util");
const emailConfig = require("./../config/emai");

let transport = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass,
  },
});

//GENERAR HTML
const generarHTML = (archivo, opciones = {}) => {
  const html = pug.renderFile(
    `${__dirname}/../views/emails/${archivo}.pug`,
    opciones
  );
  return juice(html);
};

exports.enviar = async (opciones) => {
const html = generarHTML(opciones.archivo, opciones)
const text = htmlToText.fromString(html)

  let info = transport.sendMail({
    from: '"UpTask" <no-reply@uptask.com>', // sender address
    to: opciones.usuario.email, // list of receivers
    subject: opciones.subjet, // Subject line
    text: htmlToText.fromString,
    text,
    html
  });

  const enviarEmail = util.promisify(transport.sendMail,transport)
  return enviarEmail.call(transport, info)
};


