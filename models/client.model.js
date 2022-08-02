const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const theClientModel = new Schema({
    clientName:{type:String,required:true},
    clientEmail:{type:String,required:true},
    clientPassword:{type:String,required:true},
    clientRole: { type: String, required: true, default: 'user' },
    clientNit:{type:String,required:true},
    clientOrders:[{type:Schema.Types.ObjectId}]
});

module.exports = mongoose.model('client', theClientModel);