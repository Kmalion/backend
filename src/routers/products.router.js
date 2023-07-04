const express = require('express');
const router = express.Router();
const Products = require('../dao/mongo/models/modelProducts');

// Rutas de productos
router.get('/products', (req, res) => {
  Products.find()
    .then(products => {
      if (products.length > 0) {
        res.send({ products });
      } else {
        return res.status(204).send('No se encuentran productos');
      }
    })
    .catch(err => {
      return res.status(500).send(err);
    });
});

// Obtener todos los productos y límites
router.get('/api/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    let productos = await Products.find();

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
    const producto = await Products.findById(id);

    if (!producto) {
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
router.post('/api/products', async (req, res) => {
  try {
    const newProduct = {
      pid: Math.random().toString(30).substring(2),
      ...req.body
    };
    await Products.create(newProduct);
    res.send({
      statusCode: 200,
      payload: newProduct
    });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

// PUT - Actualizar por ID
router.put('/api/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const newData = { ...req.body };
    await Products.findByIdAndUpdate(id, newData);
    res.send({
      statusCode: 200,
      payload: newData
    });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// DELETE - Borrar por ID
router.delete('/api/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Products.findByIdAndDelete(id);
    res.send({
      statusCode: 200,
      payload: { message: 'Producto eliminado' }
    });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;
