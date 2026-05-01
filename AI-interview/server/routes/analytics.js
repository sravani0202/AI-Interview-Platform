const express = require('express')
const { auth } = require('../middlewares/auth')
const { getUserAnalytics } = require('../controllers/analyticsController')

const router = express.Router()

router.use(auth)

router.get('/performance', getUserAnalytics)

module.exports = router
