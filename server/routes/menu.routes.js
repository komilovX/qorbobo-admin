const { Router } = require("express");
const passport = require("passport");
const upload = require("../middleware/upload");
const pagination = require("../middleware/pagination");
const router = Router();

const ctr = require("../controller/menu.controller");
const brand = require("../controller/brand.controller");
// /api/menu/category

router.post(
  "/category",
  passport.authenticate("jwt", { session: false }),
  ctr.createCategory
);

router.get(
  "/category",
  passport.authenticate("jwt", { session: false }),
  ctr.findAllCategories
);

router.get(
  "/category/sort",
  passport.authenticate("jwt", { session: false }),
  ctr.findAllSortedCategories
);

router.get(
  "/category/:id",
  passport.authenticate("jwt", { session: false }),
  ctr.findCategoryById
);

router.put(
  "/category/:id",
  passport.authenticate("jwt", { session: false }),
  ctr.updateCategoryById
);

router.delete(
  "/category/:id",
  passport.authenticate("jwt", { session: false }),
  ctr.deleteCategoryById
);

router.put(
  "/category/hide/:id",
  passport.authenticate("jwt", { session: false }),
  ctr.hideCategoryById
);

// /api/menu/products

router.post(
  "/product",
  passport.authenticate("jwt", { session: false }),
  ctr.createProduct
);
router.get(
  "/product",
  passport.authenticate("jwt", { session: false }),
  pagination("products"),
  ctr.findAllProducts
);
router.get(
  "/product/:id",
  passport.authenticate("jwt", { session: false }),
  ctr.findProductById
);
router.put(
  "/product/:id",
  passport.authenticate("jwt", { session: false }),
  ctr.updateProductById
);
router.delete(
  "/product/:id",
  passport.authenticate("jwt", { session: false }),
  ctr.deleteProductById
);
router.put(
  "/product/hide/:id",
  passport.authenticate("jwt", { session: false }),
  ctr.hideProductById
);

// /api/menu/brands

router.get(
  "/brands",
  pagination("brand"),
  passport.authenticate("jwt", { session: false }),
  brand.findAllBrands
);
router.post(
  "/brands",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  brand.createBrand
);
router.get(
  "/brands/:id",
  passport.authenticate("jwt", { session: false }),
  brand.findById
);
router.put(
  "/brands/:id",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  brand.updateById
);
router.delete(
  "/brands/:id",
  passport.authenticate("jwt", { session: false }),
  brand.deleteById
);
module.exports = router;
