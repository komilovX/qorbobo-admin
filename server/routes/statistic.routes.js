const { Router } = require('express');
const router = Router();
const sequelize = require('sequelize');
const Users = require('../models/user.model');
const Orders = require('../models/orders.model');
router.get('/', async (req, res) => {
  try {
    const date = req.query.date || new Date()
    const users = await Users.findAll({
      attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'users']],
    })
    res.json(users)
  } catch (e) {
    console.log('e', e)
    res.status(500).json(e)
  }
})


module.exports = router
