const express = require('express');
const { Router } = express;
const passport = require('passport');
const routerAuth = new Router();


// Ruta para mostrar el formulario de registro
routerAuth.get('/register', (req, res) => {
  res.render('register'); // Aquí debes crear la vista 'register.handlebars'
});

// Ruta para procesar el registro
routerAuth.post('/register-auth', passport.authenticate('register', {
  successRedirect: '/view/login', // Redirige al perfil del usuario después del registro exitoso
  failureRedirect: '/register', // Redirige al formulario de registro en caso de fallo
}));

//
// Ruta para procesar el inicio de sesión
routerAuth.post('/login-auth', (req, res, next) => {
  passport.authenticate('login', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error', info.message); // Agregar el mensaje flash en caso de fallo
      return res.redirect('/view/login'); // Redirige al formulario de inicio de sesión en caso de fallo
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/view/profile'); // Redirige al perfil del usuario después del inicio de sesión exitoso
    });
  })(req, res, next);
});

module.exports = routerAuth;
