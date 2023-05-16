const ProductManager = require('./ProductManager');
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));

// Creaamos una instancia de ProductManager 
const productManager = new ProductManager('productos.json');

app.get('/', (req, res) => {
    res.send("Bienvenido");
});
// Topdos los productos y limites
app.get('/products', async (req, res) => {
    try {
      //USo limit
      const limit = parseInt(req.query.limit);

      // Obtiene los productos del ProductManager
      let productos = await productManager.getProducts();
  
      // USo el límite
      if (!isNaN(limit)) {
        productos = productos.slice(0, limit);
      }
      // Envía los productos respuesta  
      res.json(productos);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      
    }
  });
////// por ID

app.get('/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id)
    // Obtiene el Producto por ID
    let producto = await productManager.getProductById(id);
    // Envía los productos respuesta  
    res.json(producto);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
  }
});

app.listen(8080, () => {
    console.log("Servidor en el puerto 8080!!");
});
