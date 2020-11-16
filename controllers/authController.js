const passport = require("passport");
const Usuario = require("./../models/Usuarios");
const crypto = require("crypto");
const Usuarios = require("./../models/Usuarios");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt-nodejs");
const enviarEmail = require("../handler/email");

exports.autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/iniciar-sesion",
  failureFlash: true,
  badRequestMessage: "Ambos campos son obligatorios",
});

//USUARIO AUTENtICADO
exports.usuarioAutenticado = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/iniciar-sesion");
};

//CERRAR SESION
exports.cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/iniciar-sesion");
  });
};

//RESTABLECER PASS
exports.enviarToken = async (req, res) => {
  const usuario = await Usuario.findOne({ where: { email: req.body.email } });

  if (!usuario) {
    req.flash("error", "No existe esa cuenta");
    res.render("reestablecer", {
      nombrePagina: "Reestablecer contraseña",
      mensajes: req.flash(),
    });
  }

  usuario.token = crypto.randomBytes(20).toString("hex");
  usuario.expiracion = Date.now() + 3600000;

  await usuario.save();

  const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

  //ENVIA EL CORREO CON EL TOKEN
  await enviarEmail.enviar({
    usuario,
    subjet: "Password Reset",
    resetUrl,
    archivo: 'reestablecerPassword',
  });

  res.redirect('/iniciar-sesion')
};

exports.validarToken = async (req, res) => {
  const usuario = await Usuario.findOne({
    where: {
      token: req.params.token,
    },
  });

  if (!usuario) {
    req.flash("error", "Hubo un error");
    res.redirect("/reestablecer");
  }

  res.render("resetPassword", {
    nombrePagina: "Restablecer Password",
  });
};

exports.actualizarPassword = async (req, res) => {
  //VERIFICA TOKEN Y EXPIRACION DEL MISMO
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
      expiracion: {
        [Op.gte]: Date.now(),
      },
    },
  });

  if (!usuario) {
    req.flash("error", "No Valido");
    res.redirect("/reestablecer");
  }

  usuario.token = null;
  usuario.expiracion = null;
  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  await usuario.save();
  req.flash("correcto", "Tu password se ha cambiado correctamente");
  res.redirect("/iniciar-sesion");
};
