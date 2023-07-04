//Administrador de productos ---- Crsitian Camilo Florez Prieto --- Primera pre entrega proyecto final --- Backend

// Llamo a FS File system
const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
  }
  //////////////////////
  // Agregar productos//
async addProduct(newProduct) {
  let products = await fs.promises.readFile(this.path, "utf-8");
  let productParse = JSON.parse(products);
  let { code } = newProduct;

  // Verificar si el código del producto ya existe
  const codeExists = productParse.some((product) => product.code === code);
  if (codeExists) {
    console.log("Error al crear el producto: este código ya existe.");
    return; // Salir de la función para evitar la ejecución adicional
  }

  let pid = Math.random().toString(30).substring(2);
  let newProducto = { pid, ...newProduct };
  
  productParse.push(newProducto);
  
  await fs.promises.writeFile(
    this.path,
    JSON.stringify(productParse, null, 2),
    "utf-8"
  );
  
  console.table(newProducto);
  console.log("Creación de producto satisfactoria!");
}

  ///////////////////////
  // Mostrar Productos//
  async getProducts(limit) {
    try {
      const products = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(products);
    } catch (error) {
      console.error('Error al leer el archivo de productos:', error);
      throw error;
    }
  }
  /////////////////////////////
  //Mostrar Poroductos por ID//
  async getProductById(id) {
    try {
      let products = await fs.promises.readFile(this.path, "utf-8");
      let productParse = JSON.parse(products);
  
      const productFound = productParse.find((product) => product.id === id);
      if (productFound) {
        console.log("Producto encontrado", productFound);
        return productFound;
      } else {
        const error = "Producto no encontrado por ese ID";
        return error
      }
    } catch (error) {
      console.error('Error al obtener el producto por ID:', error);
    }
  }
  

  //////////////////////
  // Actualizar Datos //
async updateProduct(id, newData) {
  let products = await fs.promises.readFile(this.path, "utf-8");
  let productParse = JSON.parse(products);

  let productUpdated = false;

  const updatedProduct = productParse.map((item) => {
    if (item.id === id) {
      console.log("Producto actualizado correctamente...");
      productUpdated = true;
      return { ...item, ...newData };
    }
    return item;
  });

  if (productUpdated) {
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(updatedProduct, null, 2)
    );
  } else {
    console.error("No se pudo actualizar el producto. ID no encontrado.");
  }
}



  ///////////////////////
  // Eliminar Productos//
async deleteProduct(id) {
  let product = await fs.promises.readFile(this.path, "utf-8");
  let productParse = JSON.parse(product);

  const arrayNew = productParse.filter((ele) => ele.id !== id);

  if (arrayNew.length < productParse.length) {
    console.table("Producto eliminado satisfactoriamente !!");
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(arrayNew, null, 2),
      "utf-8"
    );
  } else {
    console.error("Producto no encontrado para eliminar");
  }
}
}

/////////////////////////////////////Instancias/////////////////////////////

//let newProduct = new ProductManager("./productos.json");

// // Mostrar Productos
//newProduct.getProducts();

// // //Agregar Productos
// // newProduct.addProduct({
// //   title: "producto prueba 8",
// //   description: "Este es otro producto de prueba",
// //   price: 300,
// //   thumbnail: "Sin Imagen",
// //   code: "abc132",
// //   stock: 30
// // });

// // Actualizar producto

// newProduct.updateProduct('28nao2a990k', {
//   title: "producto actualizado 2",
//   description: "Este es otro producto de prueba ACTUALIZADO 0-7",
//   price: 300,
//   thumbnail: "Sin Imagen",
//   code: "abc131",
//   stock: 30,
// });


// //Buscar producto por ID
// console.log(newProduct.getProductById("sjkbhd767sbdffd"));
// newProduct.getProducts();

// //Borrar Productos
// //newProduct.deleteProduct("p94c0575bh6");


module.exports = ProductManager;