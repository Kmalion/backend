const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager');

// Creaamos una instancia de ProductManager 
const productManager = new ProductManager('./productos.json');

// Rutas de productos
router.get('/', (req, res) => {  
    res.send("Bienvenido");
});

// Todos los productos y límites
router.get('/api/products', async (req, res) => {
  try {
      const limit = parseInt(req.query.limit);

      let productos = await productManager.getProducts();

      if (!isNaN(limit)) {
          productos = productos.slice(0, limit);
      }

      res.json(productos);
  } catch (error) {
      console.error('Error al obtener los productos:', error);
      res.status(500).json({ error: 'Error al obtener los productos' });
  }
});


// Obtener producto por ID
router.get('/api/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        let producto = await productManager.getProductById(id);

        if (producto === "Producto no encontrado por ese ID") {
            res.status(404).json({ error: 'Producto no encontrado' });
        } else {
            res.json(producto);
        }
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});
// POST
router.post('/api/products', async (req, res) =>{
  const newProduct = {
    pid: Math.random().toString(30).substring(2),
    ...req.body
  };
  await productManager.addProduct(newProduct)
    res.send({
      statuscode: 200,
      payload: newProduct
    })
})

// PUT // actualizar por ID
router.put('/api/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const newData = {
      ...req.body
    };
    await productManager.updateProduct(id, newData);
    res.send({
      statusCode: 200,
      payload: newData
    });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// DELETE // BORRAR por ID
router.delete('/api/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const newData = {
      ...req.body
    };
    await productManager.deleteProduct(id);
    res.send({
      statusCode: 200,
      payload: newData
    });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});


module.exports = router;
