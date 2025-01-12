const mongoose= require('mongoose');

const postSchema = new mongoose.Schema({
    postId:
    {
        type:String,
        required:true
    },
    title:
    {
        type:String,
        required:true
    },
    isbn13:
    {
        type:Number,
        required:true
    },
    condition:
    {
        type:String,
    },
    price:{
        type:Number,
        required:true
    },
    quantity:
    {
        type:Number,
        required:true
    },
    thumbnail:
    {
        type:String,
        required:true
    }
})

mongoose.exports = mongoose.model('Post',postSchema);