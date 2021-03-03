const { Router } = require("express");
const passport = require("passport");
const Delivery = require("../models/delivery.model");
const DeliveryTime = require("../models/delivery_time.model");
const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let delivery = await Delivery.findByPk(1);
      if (!delivery) {
        delivery = await Delivery.create();
      }
      res.json(delivery);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await Delivery.update(
        {
          price: req.body.price,
          limit: req.body.limit
        },
        {
          where: { id: 1 }
        }
      );
      const delivery = await Delivery.findByPk(1);
      res.json(delivery);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

router.get(
  "/time",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const times = await DeliveryTime.findAll({ raw: true });
      res.json(times);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);
router.post(
  "/time",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const time = await DeliveryTime.create({
        time: req.body.time,
        time_uz: req.body.time_uz
      });
      res.json(time);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);
router.delete(
  "/time/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await DeliveryTime.destroy({
        where: { id: req.params.id }
      });
      res.json("ok");
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

module.exports = router;
