const express = require('express')
const { auth } = require('../middlewares/auth')
const upload = require('../middlewares/upload')
const {
  createInterview,
  getInterview,
  updateInterview,
  getQuestion,
  submitAnswer,
  getResults,
  getAllInterviews,
  deleteInterview
} = require('../controllers/interviewController')

const router = express.Router()

router.use(auth)

router.post('/create', upload.single('resume'), createInterview)
router.get('/', getAllInterviews)
router.get('/:id', getInterview)
router.put('/:id', updateInterview)
router.get('/:id/question/:index', getQuestion)
router.post('/:id/answer', submitAnswer)
router.post('/:id/submit-media', upload.single('media'), (req, res) => {
  res.json({ message: 'Media submitted' })
})
router.delete('/:id', deleteInterview)
router.get('/:id/results', getResults)

module.exports = router
