const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/database')

const Ship = sequelize.define('ship', {
    shipId:{
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


module.exports = Ship