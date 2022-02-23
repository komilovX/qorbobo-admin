const Orders = require("../models/orders.model");
const axios = require("axios");
const keys = require("../keys");
const Op = require("sequelize").Op;
// api/orders

module.exports.getAllOrder = async (req, res) => {
  try {
    const orders = await Orders.findAll({ raw: true, order: [["id", "DESC"]] });
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

module.exports.changeToOrderSended = async (req, res) => {
  try {
    await Orders.update(
      {
        isSended: true
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
    const text = encodeURI("Ваш заказ оформлен");
    axios.post(
      `https://api.telegram.org/bot${keys.TOKEN}/sendMessage?chat_id=${req.body.chat_id}&text=${text}`
    );

    res.json({ messages: "changed!" });
  } catch (e) {
    console.log(e);
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

module.exports.getOrderReportByProduct = async (req, res) => {
  try {
    const date = new Date();
    let { dateFrom, dateTo } = req.query;
    if (!dateFrom || dateFrom == "undefined") {
      dateFrom = new Date(date.getFullYear(), date.getMonth(), 1);
    }
    if (!dateTo || dateTo == "undefined") {
      dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
    const orders = await Orders.findAll({ 
      raw: true, 
      where: { 
        status: "delivered",
        createdAt: {
          [Op.lte]: dateTo,
          [Op.gte]: dateFrom
        }
      },
      attributes: ['id', 'products', 'createdAt'],
    });
    const data = {
      content: orders,
      dateFrom,
      dateTo
    }
    res.json(data);
  } catch (e) {
    res.status(500).json(e);
  }
};

module.exports.getOrderReports = async (req, res) => {
  try {
    const date = new Date();
    let { dateFrom, dateTo } = req.query;
    if (!dateFrom || dateFrom == "undefined") {
      dateFrom = new Date(date.getFullYear(), date.getMonth(), 1);
    }
    if (!dateTo || dateTo == "undefined") {
      dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
    const orders = await Orders.findAll({ 
      raw: true, 
      where: { 
        status: "delivered",
        createdAt: {
          [Op.lte]: dateTo,
          [Op.gte]: dateFrom
        }
      },
      attributes: ['id', 'products', 'orderType', 'createdAt'],
    });
    const data = {
      content: orders,
      dateFrom,
      dateTo
    }
    res.json(data);
  } catch (e) {
    res.status(500).json(e);
  }
};

module.exports.getOrderReportsByClient = async (req, res) => {
  try {
    const date = new Date();
    let { dateFrom, dateTo } = req.query;
    if (!dateFrom || dateFrom == "undefined") {
      dateFrom = new Date(date.getFullYear(), date.getMonth(), 1);
    }
    if (!dateTo || dateTo == "undefined") {
      dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
    const orders = await Orders.findAll({ 
      raw: true, 
      where: { 
        status: "delivered",
        createdAt: {
          [Op.lte]: dateTo,
          [Op.gte]: dateFrom
        }
      },
      attributes: ['id', 'products', 'clientName', 'clientPhone', 'createdAt'],
    });
    const data = {
      content: orders,
      dateFrom,
      dateTo
    }
    res.json(data);
  } catch (e) {
    res.status(500).json(e);
  }
};