const passport = require('passport');
const { Router } = require('express')
const router = Router()

const { createUser, loginSystem, findAll, getById, updateById, deleteById } = require('../controller/auth.controller')

router.post(
  '/login',
  loginSystem
)
router.post(
  '/create',
  passport.authenticate('jwt',{session:false}),
  createUser
)
router.get(
  '/admins',
  passport.authenticate('jwt',{session:false}),
  findAll
)
router.get(
  '/admin/:id',
  passport.authenticate('jwt',{session:false}),
  getById
)
router.put(
  '/admin/:id',
  passport.authenticate('jwt',{session:false}),
  updateById
)
router.delete(
  '/admin/:id',
  passport.authenticate('jwt',{session:false}),
  deleteById
)

module.exports = router
