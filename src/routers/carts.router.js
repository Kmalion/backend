const express = require('express');
const router = express.Router();
const Cart = require('../dao/mongo/models/modelCarts');

// Rutas

router.get('/api/carts', async (req, res) => {
  res.send("Carritos");
});

// POST
router.post('/api/carts', async (req, res) => {
  try {
    const newCart = new Cart({
      cid: Math.random().toString(30).substring(2),
    });
    const products = { ...req.body };
    newCart.products.push(products);
    await newCart.save();
    res.send({
      statusCode: 200,
      payload: newCart
    });
  } catch (error) {
    console.error('Error al crear el carrito:', error);
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

// Obtener producto por ID de Carrito
router.get('/api/carts/:id', async (req, res) => {
  try {
    const cartId = req.params.id;

    // Obtener el carrito por ID
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Obtener los productos del carrito
    const products = cart.products;
    res.json(products);
  } catch (error) {
    console.error('Error al obtener los productos por ID de carrito:', error);
    res.status(500).json({ error: 'Error al obtener los productos por ID de carrito' });
  }
});

// POST: Agregar productos al carrito por ID
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    // Verificar si 'quantity' está presente y es un número válido
    if (quantity === undefined || isNaN(quantity) || parseInt(quantity) <= 0) {
      return res.status(400).json({ error: 'La cantidad debe ser un número válido mayor a cero' });
    }

    // Obtener el carrito por su ID utilizando Mongoose
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Verificar si el producto ya está en el carrito
    const productIndex = cart.products.findIndex((product) => product.product === productId);

    if (productIndex !== -1) {
      // Si el producto ya está en el carrito, incrementar la cantidad
      cart.products[productIndex].quantity += quantity;
    } else {
      // Si el producto no está en el carrito, agregarlo como un nuevo objeto
      const productToAdd = {
        product: productId,
        quantity: quantity
      };

      cart.products.push(productToAdd);
    }

    // Guardar el carrito actualizado utilizando Mongoose
    await cart.save();

    // Retornar el carrito actualizado como respuesta
    res.json(cart);
  } catch (error) {
    console.error('Error al agregar el producto al carrito:', error);
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

module.exports = router;
