const { Router } = require('express');
const router = Router()
const passport = require('passport');
const upload = require('../middleware/upload')
const ctr = require('../controller/send_message.controller')


//  /api/send_message
router.get(
  '/',
  passport.authenticate('jwt',{session:false}),
  ctr.findAllMessages
)
router.post(
  '/',
  passport.authenticate('jwt',{session:false}),
  upload.single('image'),
  ctr.createMessage
)
router.post(
  '/send',
  passport.authenticate('jwt',{session:false}),
  ctr.sendMessageNow
)
router.get(
  '/:id',
  passport.authenticate('jwt',{session:false}),
  ctr.findById
)
router.put(
  '/:id',
  passport.authenticate('jwt',{session:false}),
  ctr.updateById
)
router.delete(
  '/:id',
  passport.authenticate('jwt',{session:false}),
  ctr.deleteById
)



module.exports = router
