const { Router } = require("express");
const router = Router();

const passport = require("passport");
const pagination = require("../middleware/pagination");

const ctr = require("../controller/order.controller");
// api/orders/
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  ctr.getAllOrder
);

router.get(
  "/canceled",
  passport.authenticate("jwt", { session: false }),
  pagination("canceledOrders"),
  ctr.getAllCanceledOrders
);

router.get(
  "/delivered",
  passport.authenticate("jwt", { session: false }),
  pagination("deliveredOrders"),
  ctr.getAllDeliveredOrders
);

router.get(
  "/get-product-report",
  passport.authenticate("jwt", { session: false }),
  ctr.getOrderReportByProduct
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  ctr.findById
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  ctr.changeStatus
);

router.put(
  "/orderSended/:id",
  passport.authenticate("jwt", { session: false }),
  ctr.changeToOrderSended
);

router.put(
  "/accept/:id",
  passport.authenticate("jwt", { session: false }),
  ctr.acceptOrder
);
router.post("/new_order", ctr.newOrder);

module.exports = router;
