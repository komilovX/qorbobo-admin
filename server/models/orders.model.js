const Sequelize = require("sequelize");
const sequelize = require("../database");

const Orders = sequelize.define("orders", {
  date: {
    type: Sequelize.DATE,
    defaultValue: new Date()
  },
  chat_id: {
    type: Sequelize.INTEGER
  },
  clientName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  clientPhone: {
    type: Sequelize.STRING,
    allowNull: false
  },
  orderType: {
    type: Sequelize.STRING,
    allowNull: false
  },
  system: Sequelize.STRING,
  address: Sequelize.STRING,
  district: {
    type: Sequelize.STRING
  },
  delivery: {
    type: Sequelize.FLOAT,
    defaultValue: 9000
  },
  delivery_time: {
    type: Sequelize.STRING
  },
  total: {
    type: Sequelize.FLOAT,
    defaultValue: 0
  },
  products: Sequelize.TEXT("long"),
  status: {
    type: Sequelize.STRING,
    defaultValue: "new"
  },
  isSended: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  isPaid: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT
});
module.exports = Orders;
