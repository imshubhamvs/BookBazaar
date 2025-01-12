const mongoose = require('mongoose');
 
const vendorSchema = new mongoose.Schema({
    userId:{
        type:Number,
        required:true
    },
    Items:[]
})
module.exports = mongoose.model('Vendor',vendorSchema);