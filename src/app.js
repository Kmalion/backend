const ProductManager = require('./ProductManager');
const express = require('express');
const app = express();
const productsRouter = require ('./routers/products.router') 
const cartsRouter = require ('./routers/carts.router') 

//MiddleWares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));



//Rutas
app.use(productsRouter)
app.use(cartsRouter)


app.listen(8080, () => {
    console.log("Servidor en el puerto 8080 !!");
});
