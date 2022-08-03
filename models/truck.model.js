const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const truckModel = new Schema({
    truckId:{type:String,required:true},
    status:{type:String,required:true},
    capacity:{type:Number,required:true},
    model:{type:String,required:true},
    brand:{type:String,required:true},
    year:{type:Number,required:true},
})




module.exports = mongoose.model('truck',truckModel)