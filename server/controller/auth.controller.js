const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admins = require("../models/admin.model");
const keys = require("../keys");

module.exports.createUser = async (req, res) => {
  try {
    const condidate = await Admins.findOne({
      where: { login: req.body.login }
    });

    if (condidate) {
      res.status(409).json({ message: "Этот логин уже занят" });
    } else {
      const salt = bcrypt.genSaltSync(10);
      const user = await Admins.create({
        name: req.body.name,
        login: req.body.login,
        password: bcrypt.hashSync(req.body.password, salt),
        role: req.body.role
      });
      res.status(201).json(user);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.loginSystem = async (req, res) => {
  try {
    const condidate = await Admins.findOne({
      where: { login: req.body.login }
    });
    if (condidate) {
      const isPasswordCorrect = bcrypt.compareSync(
        req.body.password,
        condidate.password
      );
      if (isPasswordCorrect) {
        const token = jwt.sign(
          {
            login: condidate.login,
            userId: condidate.id,
            role: condidate.role
          },
          keys.JWT,
          { expiresIn: 2 * 60 * 60 }
        );
        res.json(token);
      } else {
        res
          .status(404)
          .json({ message: "Такой логин и/или пароль не существует!" });
      }
    } else {
      res
        .status(404)
        .json({ message: "Такой логин и/или пароль не существует!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
module.exports.findAll = async (req, res) => {
  try {
    const admins = await Admins.findAll({ raw: true });
    res.json(admins);
  } catch (e) {
    res.status(500).json(e);
  }
};
module.exports.updateById = async (req, res) => {
  try {
    if (req.body.password) {
      const salt = bcrypt.genSaltSync(10);
      await Admins.update(
        {
          name: req.body.name,
          login: req.body.login,
          password: bcrypt.hashSync(req.body.password, salt),
          role: req.body.role
        },
        {
          where: { id: +req.params.id }
        }
      );
    } else {
      await Admins.update(
        {
          name: req.body.name,
          login: req.body.login,
          role: req.body.role
        },
        {
          where: { id: +req.params.id }
        }
      );
    }
    res.json({ message: "Updated" });
  } catch (e) {
    res.status(500).json(e);
  }
};
module.exports.getById = async (req, res) => {
  try {
    const admin = await Admins.findByPk(+req.params.id);
    res.json(admin);
  } catch (e) {
    res.status(500).json(e);
  }
};

module.exports.deleteById = async (req, res) => {
  try {
    await Admins.destroy({ where: { id: +req.params.id } });
    res.json({ message: "deleted" });
  } catch (e) {
    res.status(500).json(e);
  }
};
