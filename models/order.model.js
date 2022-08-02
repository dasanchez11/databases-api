const mongoose = require('mongoose');
const Schema = mongoose.Schema

const orderModel = new Schema({
    clientId:{type:mongoose.Types.ObjectId,required:true},
    orderStatus:{type:String,default:'inProgress'},
    transportType:{type:String,required:true},
    productType:{type:String,required:true},
    productQuantity:{type:Number,required:true},
    registerDate:{type:String,required:true},
    deliveryDate:{type:String,required:true},
    deliveryPrice:{type:Number,required:true},
    deliveryDiscount:{type:Number,required:true},
    guideNumber:{type:String,required:true},
    wareHouseDelivery:{type:String,default:undefined},
    portDelivery:{type:String,default:undefined},
    deliveryVehicle:{type:String,default:undefined},
    fleetNumber:{type:String,default:undefined},
})


module.exports = mongoose.model('order',orderModel)