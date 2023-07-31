const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt');
const saltRounds = 10;


const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallBack: true, usernameField: 'email  ' },
        async (req, username, password, done) => {
            try{
                let newUser = req.body
                let user = users.find(us => {
                    return us.email == dataUser.email
                })
                if (user) {
                    console.log('El usuario ya existe')
                    done(null, false)
                }
                newUser.id = Math.random()
                // Encriptar la contraseña
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                users.push(newUser)
                done(null, newUser)
            }catch(err){
            return done('Error al crear el usuario')
        }},
        passport.serializeUser((user, done)=>{
            done(null, user._id)
        }),
        passport.deserializeUser((id, done)=>{
            let user = users.find(us => {
                return us.id == id
            })
            done(null, user)
        })
    )) 
}

module.exports =initializePassport
