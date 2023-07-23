const express = require('express');
const { Router } = express;
const User = require('../dao/mongo/models/modelUsers');
const routerAuth = new Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;



routerAuth.get('/all', async (req, res) => {
  try {
    const users = await User.find({}).exec();
    res.send(users);
  } catch (error) {
    console.error('Error al obtener todos los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener todos los usuarios' });
  }
});

routerAuth.use(express.urlencoded({ extended: false }));

routerAuth.post('/register-auth', async (req, res) => {
  try {
      const { first_name, last_name, email, age, password, role } = req.body;
      console.log('Datos del formulario:', req.body);

      const existingUser = await User.findOne({ email }).exec();
      console.log('Usuario existente:', existingUser);

      if (existingUser) {
          console.log('El usuario ya existe. Por favor, inicia sesión.');
          return res.send('El usuario ya existe. Por favor, inicia sesión.');
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Crear un nuevo usuario con la contraseña encriptada
      const newUser = new User({
          first_name,
          last_name,
          email,
          age,
          password: hashedPassword, // Guardar la contraseña encriptada en la base de datos
          role
      });
      console.log('Nuevo usuario:', newUser);

      // Guardar el nuevo usuario en la base de datos
      await newUser.save();
      console.log('Usuario guardado:', newUser);

      // Redirigir al usuario a la página de perfil después del registro exitoso
      req.session.email = newUser.email;
      req.session.first_name = newUser.first_name;
      req.session.last_name = newUser.last_name;
      req.session.age = newUser.age;
      req.session.role = newUser.role;
      res.redirect('/view/profile');
  } catch (error) {
      console.error('Error al registrar el usuario:', error);
      res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});




routerAuth.post('/login-auth', async (req, res) => {
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


module.exports = routerAuth;
