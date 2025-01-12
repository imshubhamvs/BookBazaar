const mongoose = require('mongoose');

const order = mongoose.Schema({
    orderId:
    {
        type:String,
        required:true
    },
    buyerId:
    {
        type:String,
        required:true
    },
    vendorId:
    {
        type:String,
        required:true
    },
    postId:
    {
        type:String,
        required:true
    },
    quantity:
    {
        type:Number,
        required:true
    },
    Address:
    {
        type:String,
        required:true
    }

})

module.exports = mongoose.model('Order',order);