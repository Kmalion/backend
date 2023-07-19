const express = require('express');
const router = express.Router();
const Cart = require('../dao/mongo/models/modelCarts');
const Product = require('../dao/mongo/models/modelProducts');

// Rutas

router.get('/api/carts', async (req, res) => {
  try {
    const carts = await Cart.find().populate('products.product').lean();

    res.render('carts', { carts });
  } catch (error) {
    console.error('Error al obtener los carritos:', error);
    res.status(500).json({ error: 'Error al obtener los carritos' });
  }
});


router.get('/cart/add/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;

    // Resto del código para agregar el producto al carrito
    console.log('Producto agregado:', productId); // Imprime el ID del producto agregado en la consola

    // Agregar producto a carrito con populate
    const cart1 = await Cart.findOne({_id: '64b20b6f702122c5c747cd15'});
    cart1.products.push({product: productId});
    await cart1.save();

    res.redirect('/api/carts'); // Redirige al usuario al carrito después de agregar el producto
  } catch (error) {
    console.error('Error al agregar el producto al carrito:', error);
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

// POST
router.post('/api/carts', async (req, res) => {
  try {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}`;

    const newCart = new Cart({
      cid: Math.random().toString(30).substring(2),
      date: formattedDate, // Utiliza la fecha formateada
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
    const cart = await Cart.findById(cartId).populate('products.product');

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

router.delete('/api/carts/:cid/products/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid; // Obtener el ID del carrito desde los parámetros de la URL
    const productId = req.params.pid; // Obtener el ID del producto desde los parámetros de la URL

    //console.log('Carrito ID:', cartId);
    //console.log('Producto ID:', productId);

    // Buscar el carrito por su ID
    const cart = await Cart.findById(cartId);

    console.log('Carrito encontrado:', cart);

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Filtrar los productos del carrito, excluyendo el producto que se desea eliminar
    cart.products = cart.products.filter(item => item.product.toString() !== productId);

    //console.log('Carrito después de filtrar productos:', cart);

    // Eliminar el producto del carrito
    await cart.updateOne({ $pull: { products: { product: productId } } });

    console.log('Producto eliminado del carrito');

    res.status(200).json({ message: 'Producto eliminado del carrito exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el producto del carrito:', error);
    res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
  }
});

// PUT Actualizar cantidades de producto en carrito
router.put('/api/carts/:cid/products/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    // Buscar el carrito por su ID
    const cart = await Cart.findById(cartId).populate('products.product');

    console.log('Carrito encontrado:', cart);

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Buscar el producto en el carrito por su ID
    const product = cart.products.find(item => item.product.equals(productId));


    console.log('Producto encontrado:', product);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    // Validar que la cantidad sea un número válido mayor a cero
    if (isNaN(quantity) || parseInt(quantity) <= 0) {
      return res.status(400).json({ error: 'La cantidad debe ser un número válido mayor a cero' });
    }

    // Actualizar la cantidad del producto
    product.quantity = parseInt(quantity);

    // Guardar los cambios en el carrito
    await cart.save();

    console.log('Cantidad del producto actualizada:', product.quantity);

    res.status(200).json({ message: 'Cantidad del producto actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar la cantidad del producto en el carrito:', error);
    res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
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
