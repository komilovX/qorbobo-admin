const Orders = require("../models/orders.model");
// api/orders

module.exports.getAllOrder = async (req, res) => {
  try {
    const orders = await Orders.findAll({ raw: true });
    res.json(orders);
  } catch (e) {
    res.status(500).json(e);
  }
};
module.exports.findById = async (req, res) => {
  try {
    const order = await Orders.findByPk(+req.params.id);
    res.json(order);
  } catch (e) {
    res.status(500).json(e);
  }
};
module.exports.getAllCanceledOrders = async (req, res) => {
  try {
    res.json(res.result);
  } catch (e) {
    res.status(500).json(e);
  }
};
module.exports.getAllDeliveredOrders = async (req, res) => {
  try {
    res.json(res.result);
  } catch (e) {
    res.status(500).json(e);
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    await Orders.update(
      {
        status: req.body.status
      },
      { where: { id: +req.params.id } }
    );
    res.json({ messages: "changed!" });
  } catch (e) {
    res.status(500).json(e);
  }
};
module.exports.acceptOrder = async (req, res) => {
  try {
    await Orders.update(
      {
        status: req.body.status,
        total: req.body.total,
        products: req.body.products
      },
      { where: { id: +req.params.id } }
    );
    res.json({ messages: "changed!" });
  } catch (e) {
    res.status(500).json(e);
  }
};
module.exports.newOrder = async (req, res) => {
  try {
    if (req.body.key == "new_order") {
      const order = await Orders.findByPk(req.body.orderId);
      io.emit("newOrder", order);
      res.json({ message: "recived" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};
