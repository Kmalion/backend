const mongoose = require ('mongoose')
const mongoPaginate = require ('mongoose-paginate-v2')

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        require: true
    },
    category:{
        type:String,
        require: true
    }, 
    description:{
        type:String,
        require: true
    },
    price:{
        type:Number,
        require: true
    },
    thumbnail:{
        type:String,
        require: true
    },
    code:{
        type:String,
        require: true
    }, 
    status:{
        type:Boolean,
        require: true
    },
    stock:{
        type:Number,
        require: true
    }
})

mongoose.plugin(mongoPaginate)

const Product = mongoose.model('Product', productSchema)
module.exports = Product