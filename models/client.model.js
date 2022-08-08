const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/database')

const Client = sequelize.define('client', {
    _id:{
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey: true,
        defaultValue:DataTypes.UUIDV4
    },
    clientName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  clientEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clientPassword:{
    type: DataTypes.STRING,
    allowNull: false
  },
  clientRole:{
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user'
  },
  clientNit:{
    type: DataTypes.INTEGER,
    allowNull: false
  }
});


module.exports = Client