const express = require('express');
const router = express.Router();
const CartManager = require('../CartManager');

// Creaamos una instancia de CartManager
const cartManager = new CartManager('./carrito.json');
// Rutas

router.get('/api/carts', async (req, res) =>{
    res.send("Carritos")
})

// POST
router.post('/api/carts', async (req, res) =>{
    const newCart = {
      cid: Math.random().toString(30).substring(2),
    };
    const products = {
      ...req.body  
    }
    await cartManager.addCart(newCart, products)
      res.send({
        statuscode: 200,
        payload: newCart
      })
  })

// Obtener producto por ID Carrito
router.get('/api/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
    
        // Obtener el carrito por ID
        const cart = await cartManager.getCartById(cartId);
    
        if (!cart) {
          res.status(404).json({ error: 'Carrito no encontrado' });
          return;
        }
    
        // Obtener los productos del carrito
        const products = await cartManager.getProductsByCartId(cartId);
    
        res.json(products);
      } catch (error) {
        console.error('Error al obtener los productos por ID de carrito:', error);
        res.status(500).json({ error: 'Error al obtener los productos por ID de carrito' });
      }
    });
// POST AGREGA PRODUCTOS AL CARRITO POR ID

router.post('/:cid/product/:pid', async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const quantity = req.body.quantity;
  
      // Obtener el carrito por su ID utilizando el cartManager
      const cart = await cartManager.getCartById(cartId);
  
      if (!cart) {
        // Si el carrito no existe, retornar un error 404
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
  
      // Guardar el carrito actualizado utilizando el cartManager
      await cartManager.updateCart(cartId, cart);
  
      // Retornar el carrito actualizado como respuesta
      res.json(cart);
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error);
      res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
  });
  
  

module.exports = router;