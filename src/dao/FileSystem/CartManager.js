//Administrador de carrito ---- Crsitian Camilo Florez Prieto --- Primera pre entrega proyecto final--- Backend

const fs = require('fs');

class CartManager {
  constructor(path) {
    this.path = path;
  }
  ///////CREA CARRITO/////////////
  async addCart(newCart, products) {
    try {
      let carts = await fs.promises.readFile(this.path, 'utf-8');
      let cartParse = JSON.parse(carts);

      newCart.products = products;

      cartParse.push(newCart);

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(cartParse, null, 2),
        'utf-8'
      );

      console.table(newCart);
      console.log('Carrito agregado exitosamente!');
    } catch (error) {
      console.error('Error al agregar el carrito:', error);
      throw error;
    }
  }

/// Obtener Carrito por ID //////////
  async getCartById(cartId) {
    try {
      const carts = await fs.promises.readFile(this.path, 'utf-8');
      const cartParse = JSON.parse(carts);

      const cartFound = cartParse.find((cart) => cart.cid === cartId);
      if (cartFound) {
        return cartFound;
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
      const carts = await fs.promises.readFile(this.path, 'utf-8');
      const cartsParse = JSON.parse(carts);
  
      const cart = cartsParse.find((cart) => cart.cid === cartId);
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
  //////////////////////////////////////
  //Agrega Producto por ID de carrito//
  async addProductToCart(cartId, productId) {
    try {
      let carts = await fs.promises.readFile(this.path, 'utf-8');
      let cartParse = JSON.parse(carts);
  
      const cartIndex = cartParse.findIndex((cart) => cart.cid === cartId);
  
      if (cartIndex === -1) {
        throw new Error('Carrito no encontrado');
      }
  
      const product = {
        product: productId,
        quantity: 1,
      };
  
      // Agrega el producto al arreglo "products" del carrito
      cartParse[cartIndex].products.push(product);
  
      await fs.promises.writeFile(this.path, JSON.stringify(cartParse));
  
      console.log('Producto agregado al carrito');
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error);
      throw error;
    }
  }
 ////////////////Actualiza el carrito //////////////////
  async updateCart(cartId, updatedCart) {
    try {
      const carts = await fs.promises.readFile(this.path, 'utf-8');
      const cartsParse = JSON.parse(carts);
  
      const updatedCarts = cartsParse.map((cart) => {
        if (cart.cid === cartId) {
          return updatedCart;
        }
        return cart;
      });
  
      await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts, null, 2));
  
      console.log('Carrito actualizado:', updatedCart);
    } catch (error) {
      console.error('Error al actualizar el carrito:', error);
      throw error;
    }
  }
  
  
}

module.exports = CartManager;