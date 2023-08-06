const passport = require('passport');
const { Strategy } = require('passport-github2');
const User = require ('../../dao/mongo/models/modelUsers')

passport.use(
    'auth-github',
    new Strategy(
        {
            clientID: '5a25baca7b5a267b8f54',
            clientSecret: 'f95f880a490e43d2d09ca3fc486ac543b3813528',
            callbackURL: "http://localhost:8080/auth/github/callback"
        },
        async function (accessToken, refreshToken, profile, done) {
            try {
                if (profile && profile.username) {
                    // Busca el usuario en la base de datos por su ID de GitHub
                    let gitUser = await User.findOne({ githubId: profile.id });
                    console.log(gitUser)
                    if (!gitUser) {
                        // Si el usuario no existe, crea uno nuevo
                        gitUser = new User({
                            githubId: profile.id,
                            username: profile.username,
                        });
                        await gitUser.save();
                    }

                    // Establece la sesión manualmente
                    const sessionUser = {
                        _id: gitUser._id,
                        githubId: gitUser.githubId,
                        username: gitUser.username
                        // Agrega más propiedades del usuario si es necesario
                    };
                    done(null, sessionUser);
                } else {
                    done(new Error('El perfil de usuario de GitHub no contiene información válida.'));
                }
            } catch (error) {
                done(error);
            }
        })
);