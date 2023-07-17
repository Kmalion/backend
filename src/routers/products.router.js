const express = require('express');
const router = express.Router();
const Products = require('../dao/mongo/models/modelProducts');

// Rutas de productos


router.get('/products', async (req, res) => {
  try {
    const category = req.query.category; // Obtener el valor del parámetro 'category' de la URL
    const page = parseInt(req.query.page); // Obtener el valor del parámetro 'page' de la URL y convertirlo a un número entero
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const sort = req.query.sort; // Obtener el valor del parámetro 'sort' de la URL

    let options = {};

    if (category) {
      options.category = category;
    }

    if (sort) {
      options.sort = sort;
    }

    if (limit) {
      options.limit = limit;

      if (page) {
        options.page = page;
      }
    }

    const result = await Products.paginate({}, options); // Realiza la consulta de paginación

    if (result.docs.length > 0) {
      const products = result.docs.map(doc => doc.toObject({ virtuals: true }));

      res.render('home', { 
        products,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        nextPage: result.nextPage,
        prevPage: result.prevPage
      });
    } else {
      return res.status(204).send('No se encuentran productos');
    }
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
