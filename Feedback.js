const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  questionIndex: Number,
  question: String,
  userAnswer: String,
  feedback: String,
  score: Number,
  strengths: [String],
  improvements: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Feedback', feedbackSchema)
