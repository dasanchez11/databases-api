const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/database')

const Truck = sequelize.define('truck', {
    truckId:{
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey: true,
    },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  capacity:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  model:{
    type: DataTypes.STRING,
    allowNull: false
  },
  brand:{
    type: DataTypes.STRING,
    allowNull: false
  },
  year:{
    type: DataTypes.INTEGER,
    allowNull: false
  }
});


module.exports = Truck