const {Strategy, ExtractJwt} = require('passport-jwt');
const keys = require('../keys');

const Admins = require('../models/admin.model');

const option = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.JWT
}

module.exports = new Strategy(option, async (payload, done) => {
  try {
    const condidate = await Admins.findByPk(+payload.userId)
    if (condidate) {
      done(null, condidate)
    }
    else {
      done(null, false)
    }
  } catch (e) {
    console.error(e);
  }
})
