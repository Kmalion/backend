const express = require('express');
const { Router } = express;
const routerSession = new Router();
const passport = require('passport');

///////////////////////LOCAL//////////////////////////////////////////
routerSession.get('/view/register', (req, res) => {
  console.log('Messages en /view/register:', req.flash('error'));
  res.render('register', {
    ErrorMessages: req.flash('error'),
    successMessages: req.flash('success')
  });
});



routerSession.get('/view/login', (req, res) => {
  res.render('login', { messages: req.flash('error') });
});

routerSession.post('/auth/register-auth', passport.authenticate('register', {
  successRedirect: '/view/login',
  failureRedirect: '/view/register',
  failureFlash: true, // Habilitar mensajes flash para el fallo
  successFlash: 'Registro exitoso. Ahora puedes iniciar sesión.', // Mensaje flash para el éxito
}));

// Define la ruta POST para la autenticación del inicio de sesión
routerSession.post('/auth/login-auth', passport.authenticate('login', {
  successRedirect: '/view/profile', // Redirige al perfil del usuario después del inicio de sesión exitoso
  failureRedirect: '/view/login', // Redirige a la página de inicio de sesión en caso de fallo de autenticación
  failureFlash: true, // Habilita mensajes flash para el fallo
  successFlash: 'Inicio de sesión exitoso.', // Mensaje flash para el éxito
}));
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/view/login');
};

routerSession.get('/view/profile', ensureAuthenticated, (req, res) => {
  // Aquí puedes acceder a las variables de sesión del usuario y mostrar la información en la plantilla
  res.render('profile', {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role
  });
});

//////////////////////////////////////GITHUB//////////////////////////////////////////////////////////

routerSession.get('/github', passport.authenticate('auth-github', { scope: ['user:email'] ,session:false}));

routerSession.get('/github/callback',
    (req, res, next) => {
        passport.authenticate('auth-github', { scope: ['profile'] }, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/view/login');
            }
            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/view/profileGit');
            });
        })(req, res, next);
    }
);


routerSession.get('/view/profileGit', async(req, res) => {
  res.render('profileGit', {
      username: req.user.username,
      githubId: req.user.githubId
  });
});


module.exports = routerSession;