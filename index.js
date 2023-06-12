const express = require('express');
const app = express();
const http = require('http')
const handlebars = require('express-handlebars')
const productsRouter = require ('./src/routers/products.router') 
const cartsRouter = require ('./src/routers/carts.router') 
const routerHome = require ('./src/routers/home.router')
const realTimeProductsRouter = require ('./src/routers/realTimeProducts.router.js')
const server = http.createServer(app)

// Config Socket IO
const {Server} = require ('socket.io')
const io = new Server(server)



app.use(express.static(__dirname+'/public'))

// Configuracion de HandleBars
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname+'/views')


//MiddleWares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/home', routerHome)
app.use('/', realTimeProductsRouter);




//Rutas
app.use(productsRouter)
app.use(cartsRouter)


io.on('connection', (socket) => {
    console.log("Usuario conectado...");
  });
  
app.get('/socket.io', (req, res) => {
    res.sendStatus(200);
  });
  
app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
  });
  

server.listen(8080, () => {
    console.log("Servidor en el puerto 8080 !!");
});
