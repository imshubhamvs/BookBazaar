const mongoose = require('mongoose');

const accountInfo = mongoose.Schema({
    userId:
    {
        type:String,
        required:true
    },
    upi:
    {
        type:String,
    },
    AccountNumber:
    {
        type:Number,
    },
    BankName:{
        type:String
    },
    IFSC:
    {
        type:String
    }
})
module.exports = mongoose.model('Account',accountInfo);