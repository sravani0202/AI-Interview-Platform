const mongoose = require('mongoose')

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  resumePath: {
    type: String
  },
  resumeText: {
    type: String
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  duration: {
    type: Number,
    default: 30
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  questions: [{
    questionId: mongoose.Schema.Types.ObjectId,
    text: String,
    hint: String,
    type: {
      type: String,
      enum: ['text', 'coding', 'behavioral'],
      default: 'text'
    }
  }],
  answers: [{
    questionIndex: Number,
    answer: String,
    audioPath: String,
    timeSpent: Number,
    score: Number,
    feedback: String
  }],
  score: {
    type: Number,
    default: 0
  },
  startedAt: Date,
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Interview', interviewSchema)
