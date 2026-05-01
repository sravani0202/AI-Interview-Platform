const express = require('express')
const { auth, admin } = require('../middlewares/auth')
const {
  getAllUsers,
  deleteUser,
  getAllInterviews,
  deleteInterview,
  getDashboardStats
} = require('../controllers/adminController')

const router = express.Router()

router.use(auth)

router.get('/users', getAllUsers)
router.delete('/users/:id', deleteUser)
router.get('/interviews', getAllInterviews)
router.delete('/interviews/:id', deleteInterview)
router.get('/stats', getDashboardStats)

module.exports = router
