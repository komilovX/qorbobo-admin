const sequelize = require("sequelize");
const Op = sequelize.Op;
const Brands = require("../models/brand.model");
const Products = require("../models/product.model");
const Remainder = require("../models/remainder.model");
const Supply = require("../models/supply.model");
const Users = require("../models/user.model");
const Orders = require("../models/orders.model");
module.exports = function(model) {
  return async (req, res, next) => {
    try {
      switch (model) {
        case "brand":
          if (req.query.search) {
            let data = await searchItems(req, Brands);
            res.result = data;
            next();
            break;
          }
          const brands = await Brands.findAll({
            order: [["name", "ASC"]],
            raw: true
          });
          res.result = calculus(brands, req);
          next();
          break;
        case "products":
          if (req.query.search) {
            let data = await searchItems(req, Products);
            res.result = data;
            next();
            break;
          }
          const products = await Products.findAll({
            order: [["name", "ASC"]],
            raw: true
          });
          if (!req.query.limit) {
            res.result = products;
          } else {
            res.result = calculus(products, req);
          }
          next();
          break;
        case "remainder":
          if (req.query.search) {
            let data = await searchItems(req, Remainder);
            res.result = data;
            next();
            break;
          }
          const remainder = await Remainder.findAll({
            order: [["residue", "ASC"]],
            raw: true
          });
          res.result = calculus(remainder, req);
          next();
          break;
        case "supply":
          if (req.query.search) {
            let data = await searchItems(req, Supply);
            res.result = data;
            next();
            break;
          }
          const supply = await Supply.findAll({
            order: [["date", "DESC"]],
            raw: true
          });
          res.result = calculus(supply, req);
          next();
          break;
        case "users":
          if (req.query.search) {
            let data = await searchItems(req, Users);
            res.result = data;
            next();
            break;
          }
          const users = await Users.findAll({
            order: [["first_name", "ASC"]],
            raw: true
          });
          res.result = calculus(users, req);
          next();
          break;
        case "activeUsers":
          const activeUsers = await Users.findAll({
            where: { orders: { [Op.ne]: 0 } },
            order: [["first_name", "ASC"]],
            raw: true
          });
          res.result = calculus(activeUsers, req);
          next();
          break;
        case "deliveredOrders":
          const deliveredOrders = await Orders.findAll({
            where: { status: "delivered" },
            raw: true
          });
          res.result = calculus(deliveredOrders, req);
          next();
          break;
        case "canceledOrders":
          const canceledOrders = await Orders.findAll({
            where: { status: "cancelled" },
            raw: true
          });
          res.result = calculus(canceledOrders, req);
          next();
          break;
        default:
          break;
      }
    } catch (e) {
      res.status(500).json(e);
    }
  };

  function calculus(model, req) {
    let page = +req.query.page || 1;
    let limit = +req.query.limit || 30;
    const result = {};
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    result.data = model.slice(startIndex, endIndex);
    result.size = model.length;
    return result;
  }
};

async function searchItems(req, Model) {
  try {
    const query = req.query.search.toLowerCase();
    const data = await Model.findAll({
      limit: 30,
      where: {
        name: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("name")),
          "LIKE",
          "%" + query + "%"
        )
      }
    });
    return data;
  } catch (e) {
    throw e;
  }
}
