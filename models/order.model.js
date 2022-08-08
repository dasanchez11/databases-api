const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/database')

const Order = sequelize.define('order', {
    _id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    orderStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    transportType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    registerDate:{
        type: DataTypes.STRING,
        allowNull: false
    },
    deliveryDate:{
        type: DataTypes.STRING,
        allowNull: false
    },
    deliveryPrice: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    deliveryDiscount: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }, 
    guideNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    wareHouseDelivery:{
        type: DataTypes.STRING,
        defaultValue:null
    },
    portDelivery:{
        type: DataTypes.STRING,
        defaultValue:null
    },
    deliveryVehicle:{
        type: DataTypes.STRING,
        defaultValue:null
    },
    fleetNumber:{
        type: DataTypes.STRING,
        defaultValue:null
    },
}); 


module.exports = Order