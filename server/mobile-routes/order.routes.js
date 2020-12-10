const { check } = require("express-validator");
const { Router } = require("express");
const Product = require("../models/product.model");
const Orders = require("../models/orders.model");
const Users = require("../models/user.model");
const router = Router();

async function computeOrderedproducts(products) {
  try {
    const orderedProducts = [];
    let totalPrice = 0;

    products.map(async ({ id, amount = 1 }) => {
      const product = await Product.findByPk(id);
      if (product) {
        orderedProducts.push({
          name: product.name,
          amount,
          price: product.price
        });
        totalPrice += +amount * product.price;
      }
    });
    return { orderedProducts, totalPrice };
  } catch (error) {
    throw error;
  }
}

router.post(
  "/newOrder",
  [
    check("clientId", "client id is required").exists(),
    check("orderType", "client id is required")
      .exists()
      .isIn(["cash", "payme", "click"])
      .withMessage(
        "orderType must be one of in this items: [cash, payme, click]"
      ),
    check("products", "client id is required")
      .isArray()
      .withMessage("products must be array")
  ],
  async (req, res) => {
    try {
      const { orderedProducts, totalPrice } = await computeOrderedproducts(
        req.body.products
      );

      const client = await Users.findByPk(+req.body.clientId);
      if (!client) {
        return res.status(404).json({ message: "user not found :(" });
      }
      const newOrder = await Orders.create({
        system: "📱 mobile",
        clientId: client.id,
        clientName: client.first_name,
        clientPhone: client.phone,
        orderType: req.body.orderType,
        products: JSON.stringify(orderedProducts),
        total: totalPrice
      });
      res.json(newOrder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.put("/");

module.exports = router;
