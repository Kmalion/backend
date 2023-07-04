//Administrador de carrito ---- Crsitian Camilo Florez Prieto --- Practica inmtegradora M<ongo DB--- Backend

const mongoose = require ('mongoose')
const Cart = require ('../models/modelCarts') // Importar el modelo de Cart

class CartManager {
  constructor(path) {
    this.path = path;
  }
  ///////CREA CARRITO/////////////
  async addCart(newCart, products) {
    try {
      newCart.products = products;
  
      const cart = new Cart(newCart);
      await cart.save();
  
      console.table(cart);
      console.log('Carrito agregado exitosamente!');
    } catch (error) {
      console.error('Error al agregar el carrito:', error);
      throw error;
    }
  }
  

/// Obtener Carrito por ID //////////
async getCartById(cartId) {
    try {
      const cart = await Cart.findOne({ cid: cartId });
  
      if (cart) {
        return cart;
      } else {
        return null; // Si no se encuentra el carrito, se devuelve null
      }
    } catch (error) {
      console.error('Error al obtener el carrito por ID:', error);
      throw error; // Se lanza el error para manejarlo en el controlador de la ruta
    }
  }
  
  //////////////////////////////////////
  //Mostrar producto por ID de carrito//
  async getProductsByCartId(cartId) {
    try {
      const cart = await Cart.findOne({ cid: cartId }).exec();
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
  
      const products = Object.values(cart.products);
      return products;
    } catch (error) {
      console.error('Error al obtener los productos por ID de carrito:', error);
      throw error;
    }
  }
  
  async addProductToCart(cartId, productId) {
    try {
      const cart = await Cart.findOne({ cid: cartId }).exec();
  
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
  
      const product = {
        product: productId,
        quantity: 1,
      };
  
      // Agrega el producto al arreglo "products" del carrito
      cart.products.push(product);
  
      await cart.save();
  
      console.log('Producto agregado al carrito');
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error);
      throw error;
    }
  }
  async updateCart(cartId, updatedCart) {
    try {
      const cart = await Cart.findOneAndUpdate({ cid: cartId }, updatedCart, {
        new: true,
      }).exec();
  
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
  
      console.log('Carrito actualizado:', cart);
    } catch (error) {
      console.error('Error al actualizar el carrito:', error);
      throw error;
    }
  }
  
  
}

module.exports = CartManager;