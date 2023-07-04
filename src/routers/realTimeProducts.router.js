const express = require('express');
const router = express.Router();
const Products = require('../dao/mongo/models/modelProducts');

router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await Products.find(); // Utilizar el modelo de Mongoose para obtener los productos
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).send('Ocurrió un error al obtener los productos');
  }
});

module.exports = router;
