const Proyectos = require("../models/Proyectos");
const Tareas = require("../models/Tareas");

exports.proyectoHome = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({where: {usuarioId}});

  res.render("index", {
    nombrePagina: "Proyectos",
    proyectos,
  });
};

exports.formularioProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({where: {usuarioId}});
  res.render("nuevoProyecto", {
    nombrePagina: "Nuevo Proyecto",
    proyectos,
  });
};

exports.nuevoProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({where: {usuarioId}});
  let body = req.body;
  let errores = [];

  if (!body.nombre) {
    errores.push({ texto: "Agrega nombre al proyecto" });
  }

  if (errores.length > 0) {
    console.log(errores);
    res.render("nuevoProyecto", {
      nombrePagina: "Nuevo Proyecto",
      errores,
      proyectos,
    });
  } else {
    //GUARDAR EN LA BASE DE DATOS
    const usuarioId = res.locals.usuario.id;
    await Proyectos.create({ nombre: body.nombre, usuarioId });
    res.redirect("/");
  }
};

exports.proyectoPorUrl = async (req, res, next) => {
  const usuarioId = res.locals.usuario.id;
  const proyectosPromise = Proyectos.findAll({where: {usuarioId}});
  const proyectoPromise = Proyectos.findOne({
    where: {
      url: req.params.url,
      usuarioId
    },
  });

  const [proyectos, proyecto] = await Promise.all([
    proyectosPromise,
    proyectoPromise,
  ]);

  if (!proyecto) return next();
  const tareas = await Tareas.findAll({ where: { proyectoId: proyecto.id } });


  res.render("tareas", {
    nombrePagina: "Tareas de proyecto",
    proyecto,
    proyectos,
    tareas
  });
};

exports.formularioEditar = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectosPromise = Proyectos.findAll({where: {usuarioId}});
  const proyectoPromise = Proyectos.findOne({
    where: {
      id: req.params.id,
      usuarioId
    },
  });

  const [proyectos, proyecto] = await Promise.all([
    proyectosPromise,
    proyectoPromise,
  ]);

  res.render("nuevoProyecto", {
    nombrePagina: "Editar Proyecto",
    proyectos,
    proyecto,
  });
};

exports.actualizarProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({where: {usuarioId}});
  let body = req.body;
  let errores = [];

  if (!body.nombre) {
    errores.push({ texto: "Agrega nombre al proyecto" });
  }

  if (errores.length > 0) {
    console.log(errores);
    res.render("nuevoProyecto", {
      nombrePagina: "Nuevo Proyecto",
      errores,
      proyectos,
    });
  } else {
    //ACTUALIZADO EN LA BASE DE DATOS
    await Proyectos.update(
      {
        nombre: body.nombre,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.redirect("/");
  }
};

//ELIMINAR UN PROYECTO
exports.eliminarProyecto = async (req, res, next) => {
  const { urlProyecto } = req.query;

  const resultado = await Proyectos.destroy({ where: { url: urlProyecto } });

  if (!resultado) {
    return next();
  }
};
