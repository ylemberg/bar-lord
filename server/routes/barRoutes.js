const router = require('express').Router()

const authUtil = require('../utilities/authUtil')
const barCtrl = require('../controllers/barCtrl')

<<<<<<< HEAD
// router.get('/getbar/:name', barCtrl.bars.get)
=======
// ----------------- Middleware ----------------- //
const checkToken = (req, res, next) => {
  if (process.env.AUTH_MANAGMENT_TOKEN === '' || process.env.AUTH_MANAGMENT_EXP > Date.now()) {
    authUtil.createNewToken(next.bind(this))
  } else { next() }
}

>>>>>>> origin/feat/multiTenant
router.get('/connect', barCtrl.bars.connect)
router.get('/connect/callback', barCtrl.bars.getBarStripeData)
router.get('/stripe/:token', authUtil.jwtCheck, checkToken, barCtrl.bars.finalizeBarStripeData)

module.exports = router
