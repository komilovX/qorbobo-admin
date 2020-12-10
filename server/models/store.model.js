const Sequelize = require('sequelize');
const sequelize = require('../database');

const Store = sequelize.define('store', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address: Sequelize.STRING,
  deleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
})

module.exports = Store
