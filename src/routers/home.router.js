const express = require('express');
const router = express.Router();
const Product = require('../dao/mongo/models/modelProducts');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().lean();

    if (products.length > 0) {
      res.render('home', { products });
    } else {
      return res.status(204).send('No se encuentran productos');
    }
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).send('Ocurrió un error al obtener los productos');
  }
});

module.exports = router;
