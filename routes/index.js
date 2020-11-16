const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const proyectoController = require("../controllers/ProyectoController");
const tareasController = require("../controllers/TareasController");
const usuariosControler = require("./../controllers/usuariosController");
const authController = require("./../controllers/authController");

router.get(
  "/",
  authController.usuarioAutenticado,
  proyectoController.proyectoHome
);
router.get(
  "/nuevo-proyecto",
  authController.usuarioAutenticado,
  proyectoController.formularioProyecto
);
router.post(
  "/nuevo-proyecto",
  body("nombre").not().isEmpty().trim().escape(),
  authController.usuarioAutenticado,
  proyectoController.nuevoProyecto
);

//Mostrar proyectos
router.get(
  "/proyectos/:url",
  authController.usuarioAutenticado,
  proyectoController.proyectoPorUrl
);

//EDITAR PROYECTO
router.get(
  "/proyecto/editar/:id",
  authController.usuarioAutenticado,
  proyectoController.formularioEditar
);
router.post(
  "/nuevo-proyecto/:id",
  body("nombre").not().isEmpty().trim().escape(),
  authController.usuarioAutenticado,
  proyectoController.actualizarProyecto
);

//ELIMINAR PROYECTO
router.delete(
  "/proyectos/:url",
  authController.usuarioAutenticado,
  proyectoController.eliminarProyecto
);

//AGREGAR TAREAS
router.post(
  "/proyectos/:url",
  body("tarea").not().isEmpty().trim().escape(),
  authController.usuarioAutenticado,
  tareasController.agregarTarea
);
//ACTUALIZAR TAREA
router.patch(
  "/tareas/:id",
  authController.usuarioAutenticado,
  tareasController.actualizaEstadoTarea
);
//ELIMINAR TAREA
router.delete(
  "/tareas/:id",
  authController.usuarioAutenticado,
  tareasController.eliminarTarea
);

//CREAR NUEVA CUENTA
router.get("/crear-cuenta", usuariosControler.formCrearCuenta);
router.post("/crear-cuenta", usuariosControler.crearCuenta);

//INICIAR SESION
router.get("/iniciar-sesion", usuariosControler.formIniciarSesion);
router.post("/iniciar-sesion", authController.autenticarUsuario);

router.get('/cerrar-sesion', authController.cerrarSesion)

//REESTABLESER CONTRASEÑA
router.get('/reestablecer', usuariosControler.formReestablecerPassword)
router.post('/reestablecer', authController.enviarToken)
router.get('/reestablecer/:token', authController.validarToken)
router.post('/reestablecer/:token', authController.actualizarPassword)

module.exports = router;
