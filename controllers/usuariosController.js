const Usuarios = require("./../models/Usuarios");

exports.formCrearCuenta = (req, res, next) => {
  res.render("crearCuenta", {
    nombrePagina: "Crear cuenta en UpTask",
  });
};

exports.formIniciarSesion = (req, res, next) => {
  const {error} = res.locals.mensajes
  res.render("iniciarSesion", {
    nombrePagina: "Inicia Sesion en UpTask",
    error
  });
};

exports.crearCuenta = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    await Usuarios.create({
      email,
      password,
    });
    res.redirect("/iniciar-sesion");
  } catch (error) {
    req.flash(
      "error",
      error.errors.map((error) => error.message)
    );
    res.render("crearCuenta", {
      mensajes: req.flash(),
      nombrePagina: "Crear cuenta en UpTask",
      email,
      password
    });
  }
};

exports.formReestablecerPassword = (req,res) => {
  res.render('reestablecer',{
    nombrePagina: 'Reestablecer contraseña'
  })
}
