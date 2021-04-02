const Delivers = require("../models/delivers.model");
const axios = require("axios");
const keys = require("../keys");

module.exports.findAllDelivers = async (req, res) => {
  try {
    const delivers = await Delivers.findAll({ raw: true });
    res.json(delivers);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.findDeliverById = async (req, res) => {
  try {
    const deliver = await Delivers.findByPk(req.params.id);
    res.json(deliver);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.createDeliver = async (req, res) => {
  try {
    const { name, password } = req.body;

    const deliver = await Delivers.create({
      name,
      password
    });
    res.json(deliver);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.updateDeliver = async (req, res) => {
  try {
    const { name, password } = req.body;
    await Delivers.update(
      {
        name,
        password,
        status: "new"
      },
      { where: { id: req.params.id } }
    );
    const deliver = await Delivers.findByPk(req.params.id);
    res.json(deliver);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.deleteDeliver = async (req, res) => {
  try {
    await Delivers.destroy({ where: { id: req.params.id } });
    res.json({ message: "deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.sendMessage = async (req, res) => {
  try {
    const text = encodeURI(req.body.text);
    await axios.post(
      `https://api.telegram.org/bot${keys.TOKEN_DELIVER}/sendMessage?chat_id=${req.body.chat_id}&text=${text}`
    );
    await axios.post(
      `https://api.telegram.org/bot${keys.TOKEN_DELIVER}/sendLocation?chat_id=${req.body.chat_id}&latitude=${req.body.latitude}&longitude=${req.body.longitude}`
    );

    res.json({ message: "sended!" });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(500).json({ error });
  }
};
