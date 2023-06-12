const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager');

const productManager = new ProductManager('./productos.json'); // Crear una instancia de ProductManager

router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts(); // Llamar al método getProducts() de forma asíncrona
    res.render('home', { products });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).send('Ocurrió un error al obtener los productos');
  }
});

module.exports = router;
