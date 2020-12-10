const Sequelize = require("sequelize");
const sequelize = require("../database");

const Product = sequelize.define("products", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  name_ru: {
    type: Sequelize.STRING,
    allowNull: false
  },
  photo: Sequelize.STRING,
  category_name: {
    type: Sequelize.STRING
  },
  category_id: Sequelize.INTEGER,
  price: {
    type: Sequelize.STRING,
    defaultValue: 0
  },
  comment: {
    type: Sequelize.STRING(800)
  },
  comment_ru: {
    type: Sequelize.STRING(800)
  },
  hidden: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Product;
