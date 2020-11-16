require('./models/Proyectos')
require('./models/Tareas')
require('./models/Usuarios')
const express = require('express');
const routes = require('./routes/index');
const path = require('path');
const bodyParser = require('body-parser')
const db = require('./config/db');
const helpers = require('./utils/helpers');
const flash = require('connect-flash');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const passport = require('./config/passport')
require('dotenv').config({path: 'variables.env'})
const app = express();
//HABILITAR CONTENIDO PUBLICO
app.use(express.static('public'));

//HABILITAR LAS VISTAS
app.set('views', path.join(__dirname, './views'));

//CONEXION A LA BASE DE DATOS
db.sync()
    .then(() => console.log('BASE DE DATOS ONLINE'))
    .catch((error) => console.log(error))

//HABLITAMOS LEER DATOS DEL BODY
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//HABILITAR VIEW ENGINE
app.set('view engine', 'pug');


//AGREGAR FLASH MESSAGES
app.use(flash())
app.use(cookieParser())

//SESIONES NOS PERMITE VIAJAR POR PAJINAS SIN VOLVER A AUTENTICAR
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}))

//PASSPORT
app.use(passport.initialize())
app.use(passport.session())

//PASAR EL VARDUMP A LA APLICACION
app.use((req, res, next) =>{
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
})

//IMPORTAMOS LAS RUTAS
app.use('/', routes)

//ASIGNAR PUERTO

const host = process.env.HOST || "0.0.0.0"
const port = process.env.PORT || 3000

app.listen(port,host,() => {
    console.log("El servidor esta funcionando");
});
