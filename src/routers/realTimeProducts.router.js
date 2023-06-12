const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager');

const productManager = new ProductManager('./productos.json');

router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).send('Ocurrió un error al obtener los productos');
  }
});

module.exports = router;
