const mongoose = require ('mongoose')

const cartSchema = new mongoose.Schema({
      products: [{
        pid: {
          type: String,
          required: true,
        }, 
        title:{
          type: String,
          required: true,
        } , 
        description:{
          type: String,
          required: true,
        },
        price:{
          type: Number,
          required: true,
        },
        thumbnail:{
          type: String,
          required: true,
        },
        code:{
          type: String,
          required: true,
        }, 
        stock:{
          type: Number,
          required: true,
        }
      }],
    });

const Carts = mongoose.model('Carts', cartSchema)
module.exports = Carts
