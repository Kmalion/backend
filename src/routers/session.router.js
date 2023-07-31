const express = require('express');
const { Router } = express;
const routerSession = new Router();
const passport = require('passport');
const User = require('../dao/mongo/models/modelUsers');

routerSession.get('/register', (req, res) => {
  res.render('register');
});

routerSession.get('/login', (req, res) => {
  res.render('login');
});

routerSession.post('/auth/login-auth', passport.authenticate('login', {
  successRedirect: '/view/profile', // Redirige al perfil del usuario después de la autenticación exitosa
  failureRedirect: '/view/login', // Redirige al formulario de inicio de sesión en caso de fallo
  failureFlash: true
}), (req, res) => {
  // Almacena los datos del usuario en la sesión después de la autenticación exitosa
  res.session.email = res.user.email;
  req.session.first_name = req.user.first_name;
  req.session.last_name = req.user.last_name;
  req.session.age = req.user.age;
  req.session.role = req.user.role;

  // Agregar console.log para verificar los datos del usuario en sesión
  console.log("Datos del usuario en sesión ROUTER:", req.session);
  console.log("Datos del usuario en sesión EMail:", req.user.email);

});



routerSession.post('/auth/register-auth', passport.authenticate('register', {
  successRedirect: '/view/login',
  failureRedirect: '/view/register',
  failureFlash: true // Habilitar el mensaje flash en caso de fallo de registro
}));

routerSession.get('/profile', (req, res) => {
  res.render('profile', {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role
  });
});

module.exports = routerSession;
