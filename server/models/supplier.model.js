const Sequelize = require('sequelize');
const sequelize = require('../database');

const Supplier = sequelize.define('supllier', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address: Sequelize.STRING,
  phone: Sequelize.STRING(20),
  comment: Sequelize.STRING,
  supplies: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  total_cost: {
    type: Sequelize.INTEGER(30),
    defaultValue: 0
  },
  deleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
})

module.exports = Supplier
