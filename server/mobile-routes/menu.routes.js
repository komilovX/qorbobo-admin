const {
  findAllSortedCategories,
  findCategoryById,
  findAllProducts,
  findProductById
} = require("../controller/menu.controller");
const { Router } = require("express");
const pagination = require("../middleware/pagination");
const router = Router();

router.get("/category", findAllSortedCategories);
router.get("/category/:id", findCategoryById);

router.get("/product", pagination("products"), findAllProducts);
router.get("/product/:id", findProductById);
module.exports = { mobileMenuRouter: router };
