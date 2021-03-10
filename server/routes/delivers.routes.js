const passport = require("passport");
const { Router } = require("express");
const {
  findAllDelivers,
  createDeliver,
  updateDeliver,
  deleteDeliver,
  findDeliverById,
  sendMessage
} = require("../controller/delivers.controller");

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  findAllDelivers
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  findDeliverById
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createDeliver
);
router.post(
  "/sendMessage",
  passport.authenticate("jwt", { session: false }),
  sendMessage
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  updateDeliver
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteDeliver
);

module.exports = router;
