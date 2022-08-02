const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portModel = new Schema({
    name:{type:String,required:true},
    city:{type:Number,required:true},
    address:{type:Number,required:true},
    capacity:{type:Number,required:true},
})


module.exports = mongoose.model('port',portModel)