// index.js

// Agregamos la carga de variables de entorno
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const app = express();
const http = require('http');
const handlebars = require('express-handlebars');
const productsRouter = require('./src/routers/products.router');
const cartsRouter = require('./src/routers/carts.router');
const chatRouter = require('./src/routers/chat.router');
const routerHome = require('./src/routers/home.router');
const Chat = require('./src/dao/mongo/models/modelChat');
const realTimeProductsRouter = require('./src/routers/realTimeProducts.router.js');
const routerSession = require('./src/routers/session.router.js');
const routerAuth = require('./src/routers/auth.router');
const server = http.createServer(app);
const Database = require('./db');
const MongoStore = require('connect-mongo');

//Middelware Sesiones
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.DB_CONNECTION_STRING, // Utilizamos la variable de entorno para la conexión a MongoDB
    }),
    secret: process.env.SESSION_SECRET, // Utilizamos la variable de entorno para la clave secreta de la sesión
    resave: true,
    saveUninitialized: true,
  })
);

app.get('/setSession', (req, res) => {
  req.session.mensaje = 'Hola desde la sesion';
  res.send('Sesion Creada');
});

app.get('/getSession', (req, res) => {
  res.send(req.session.mensaje);
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) res.send('Failed logout');
    res.redirect('view/login');
  });
});

/////////////////////////////
//Rutas

// Config Socket IO
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static(__dirname + '/public'));

// Configuracion de HandleBars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

//MiddleWares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routerHome);
app.use('/', realTimeProductsRouter);
app.use('/chat', chatRouter);
app.use('/products', productsRouter);
app.use('/view', routerSession);
app.use('/auth', routerAuth);
app.use('/profile', routerSession);

app.use(productsRouter);
app.use(cartsRouter);
app.use(chatRouter);

//CHAT
io.on('connection', (socket) => {
  console.log('Usuario conectado!!');
  socket.on('new-message', (data) => {
    //console.log(data);

    // Crea una nueva instancia del modelo Chat
    const newMessage = new Chat({
      user: data.user,
      message: data.message,
    });

    // Guarda el mensaje en la base de datos
    newMessage
      .save()
      .then(() => {
        console.log('Mensaje guardado en la base de datos');
      })
      .catch((error) => {
        console.log('Error al guardar el mensaje:', error);
      });

    io.emit('message-all', data); // Enviar el mensaje a todos los clientes conectados
  });
});

app.get('/socket.io', (req, res) => {
  res.sendStatus(200);
});

app.get('/socket.io/socket.io.js', (req, res) => {
  res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});

server.listen(8080, () => {
  console.log('Servidor en el puerto 8080 !!');
  //Ejecuto la base de datos
  Database.connect();
});
