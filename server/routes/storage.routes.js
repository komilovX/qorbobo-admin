const { Router } = require('express');
const router = Router()
const passport = require('passport');
const pagination = require('../middleware/pagination');
const supplier = require('../controller/supplier.controller');
const supply = require('../controller/supply.controller');
const store = require('../controller/store.controller');


// /api/storage/supplier

router.post(
  '/supplier',
  passport.authenticate('jwt',{session:false}),
  supplier.createSupplier
)
router.get(
  '/supplier',
  passport.authenticate('jwt',{session:false}),
  supplier.findAllSupplier
)
router.get(
  '/supplier/:id',
  passport.authenticate('jwt',{session:false}),
  supplier.findSupplierById
)
router.put(
  '/supplier/:id',
  passport.authenticate('jwt',{session:false}),
  supplier.updateSupplierById
)
router.put(
  '/supplier/delete/:id',
  passport.authenticate('jwt',{session:false}),
  supplier.deleteSupplierById
)

// /api/storage/supply

router.post(
  '/supply',
  passport.authenticate('jwt',{session:false}),
  supply.createSupply
)
router.get(
  '/supply',
  passport.authenticate('jwt',{session:false}),
  pagination('supply'),
  supply.findAllSupply
)
router.get(
  '/supply/calculations',
  passport.authenticate('jwt',{session:false}),
  pagination('remainder'),
  supply.findAllCalculations
)
router.put(
  '/supply/calculations',
  passport.authenticate('jwt',{session:false}),
  supply.changeResidue
)
router.get(
  '/supply/details',
  passport.authenticate('jwt',{session:false}),
  supply.findAllDetailsForSupply
)
router.get(
  '/supply/:id',
  passport.authenticate('jwt',{session:false}),
  supply.findSupplyById
)
router.put(
  '/supply/:id',
  passport.authenticate('jwt',{session:false}),
  supply.updateById
)
router.put(
  '/supply/delete/:id',
  passport.authenticate('jwt',{session:false}),
  supply.deleteSupplyById
)
router.put(
  '/supply/limit/:id',
  passport.authenticate('jwt',{session:false}),
  supply.updateLimitById
)
// /api/storage/store
router.post(
  '/store',
  passport.authenticate('jwt',{session:false}),
  store.createStore
)
router.get(
  '/store',
  passport.authenticate('jwt',{session:false}),
  store.findAllStore
)
router.get(
  '/store/:id',
  passport.authenticate('jwt',{session:false}),
  store.findStoreById
)
router.put(
  '/store/:id',
  passport.authenticate('jwt',{session:false}),
  store.updateById
)
router.put(
  '/store/delete/:id',
  passport.authenticate('jwt',{session:false}),
  store.deleteById
)

module.exports = router
