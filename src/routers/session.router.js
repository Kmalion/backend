const express = require('express');
const { Router } = express;
const routerSession = new Router();
const User = require('../dao/mongo/models/modelUsers'); 

routerSession.get('/register', (req, res) => {
  res.render('register');
});
routerSession.get('/login', (req, res) => {
  res.render('login');
});

routerSession.post('/auth/login-auth', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario en la base de datos por su correo electrónico
    const user = await User.findOne({ email }).exec();

    if (!user) {
      return res.send('Usuario no encontrado. Por favor, regístrese.');
    }

    // Verificar si la contraseña ingresada coincide con la contraseña almacenada en la base de datos
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.send('Contraseña incorrecta. Por favor, verifique sus datos.');
    }

    // Si el usuario existe y la contraseña es correcta, establecer las variables de sesión
    req.session.email = user.email;
    req.session.first_name = user.first_name;
    req.session.last_name = user.last_name;
    req.session.age = user.age;
    req.session.role = user.role;

    res.redirect('/view/profile');
  } catch (error) {
    console.error('Error al autenticar el usuario:', error);
    res.status(500).json({ error: 'Error al autenticar el usuario' });
  }
});

routerSession.post('/auth/register-auth', async (req, res) => {
    try {
      const { first_name, last_name, email, age, password } = req.body;
      const user = new User({ first_name, last_name, email, age, password });
      console.log(user)
      await user.save();
      res.redirect('/view/login'); // Redirige al inicio de sesión después del registro exitoso
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      res.status(500).json({ error: 'Error al registrar el usuario' });
    }
  });

 

routerSession.get('/profile', async (req, res) => {
  // Verificar si el usuario ha iniciado sesión antes de mostrar el perfil
  if (req.session.email) {
    try {
      const user = await User.findOne({ email: req.session.email }).exec();
      if (user) {
        res.render('profile', {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          age: user.age,
          role: user.role
        });
      } else {
        res.redirect('/view/login');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      res.redirect('/view/login');
    }
  } else {
    res.redirect('/view/login');
  }
});

module.exports = routerSession;
