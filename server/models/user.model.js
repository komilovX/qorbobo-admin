const Sequelize = require("sequelize");
const sequelize = require("../database");

const Users = sequelize.define("users", {
  chat_id: {
    type: Sequelize.INTEGER
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  last_name: Sequelize.STRING,
  phone: Sequelize.STRING,
  system: Sequelize.STRING(20)
});
module.exports = Users;
