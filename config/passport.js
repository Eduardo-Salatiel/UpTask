const localStartegy = require('passport-local').Strategy
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs')
//MODELO
const Usuario = require('../models/Usuarios')

passport.use( new localStartegy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            const user = await Usuario.findOne({where: {email: email}})
            if(!user.verificarPassword(password)){
                return done(null,false,{
                    message: 'Contraseña Incorrecta'
                    
                })
            }
            return done(null,user)
        } catch (error) {
            return done(null,false,{
                message: 'Esa cuenta no existe'
            })
        }
    }
))

passport.serializeUser((user, callback) => {
    callback(null, user)
})

passport.deserializeUser((user, callback) => {
    callback(null, user)
})

module.exports = passport;