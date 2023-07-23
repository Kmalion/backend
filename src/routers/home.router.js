const express = require('express');
const router = express.Router();
const Product = require('../dao/mongo/models/modelProducts');

router.get('/', async (req, res) => {
  res.redirect('/view/login');
});

module.exports = router;
