const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  jobTitle: String,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['technical', 'behavioral', 'coding'],
    default: 'technical'
  },
  text: {
    type: String,
    required: true
  },
  hint: String,
  expectedKeywords: [String],
  sampleAnswer: String,
  type: {
    type: String,
    enum: ['text', 'coding', 'behavioral'],
    default: 'text'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Question', questionSchema)
