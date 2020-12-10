const Sequelize = require('sequelize');
const sequelize = require('../database');

const Supply = sequelize.define('supply', {
  date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  supplier_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  supplier_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  store_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  store_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  comment: Sequelize.TEXT('long'),
  deleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  products: {
    type: Sequelize.TEXT('long'),
    allowNull: false
  },
  total: {
    type: Sequelize.FLOAT(30)
  }
})
module.exports = Supply
