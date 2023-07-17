const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    }
  }]
});

cartSchema.pre('findOne', function(next) {
  this.populate('products.product');
  next();
});
cartSchema.pre('find', function(next) {
  this.populate('products.product');
  next();
});cartSchema.pre('findById', function(next) {
  this.populate('products.product');
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;

