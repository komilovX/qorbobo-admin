const passport = require('passport');
const { Router } = require('express');
const router = Router()

const pagination = require('../middleware/pagination');

// api/users
router.get(
  '/',
  passport.authenticate('jwt',{session:false}),
  pagination('users'),
  async (req, res) => {
    try {
      res.json(res.result)
    } catch (e) {
      res.status(500).json(e)
    }
  }
)
router.get( '/active',
  passport.authenticate('jwt',{session:false}),
  pagination('activeUsers'),
  async (req, res) => {
    try {
      res.json(res.result)
    } catch (e) {
      res.status(500).json(e)
    }
  }
)



module.exports = router
