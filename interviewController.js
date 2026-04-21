const Interview = require('../models/Interview')
const Question = require('../models/Question')
const Feedback = require('../models/Feedback')
const { generateQuestions, calculateScore } = require('../utils/helpers')
const fs = require('fs')
const path = require('path')

exports.createInterview = async (req, res) => {
  try {
    const { jobTitle, jobDescription } = req.body
    const resumePath = req.file ? req.file.path : null

    const interview = new Interview({
      userId: req.userId,
      jobTitle,
      jobDescription,
      resumePath,
      status: 'not_started'
    })

    await interview.save()
    res.status(201).json({ interviewId: interview._id })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' })
    }

    if (interview.userId.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    res.json(interview)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateInterview = async (req, res) => {
  try {
    const { difficulty, duration, status } = req.body
    const interview = await Interview.findById(req.params.id)

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' })
    }

    if (status === 'in_progress') {
      interview.status = 'in_progress'
      interview.startedAt = new Date()
      interview.difficulty = difficulty || 'medium'
      interview.duration = duration || 30

      // Generate questions
      const questions = generateQuestions(interview.jobTitle, interview.difficulty)
      interview.questions = questions
    }

    await interview.save()
    res.json(interview)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getQuestion = async (req, res) => {
  try {
    const { id, index } = req.params
    const interview = await Interview.findById(id)

    if (!interview || !interview.questions[parseInt(index)]) {
      return res.status(404).json({ message: 'Question not found' })
    }

    res.json({ question: interview.questions[parseInt(index)] })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.submitAnswer = async (req, res) => {
  try {
    const { id } = req.params
    const { questionIndex, answer, timeSpent } = req.body

    const interview = await Interview.findById(id)
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' })
    }

    // Store answer
    interview.answers.push({
      questionIndex,
      answer,
      timeSpent,
      score: Math.random() * 100 // Mock scoring - integrate with AI evaluation
    })

    await interview.save()
    res.json({ message: 'Answer saved' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getResults = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' })
    }

    const score = calculateScore(interview.answers)
    
    const feedback = interview.answers.map((ans, idx) => ({
      question: interview.questions[idx]?.text,
      userAnswer: ans.answer,
      feedback: 'Good attempt. Consider improving on...', // Mock feedback
      score: ans.score || 0
    }))

    res.json({
      score,
      questionsAnswered: interview.answers.length,
      totalQuestions: interview.questions.length,
      duration: interview.duration,
      feedback
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.userId })
    res.json(interviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' })
    }

    if (interview.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    if (interview.resumePath) {
      fs.unlink(interview.resumePath, () => {})
    }

    await Interview.findByIdAndDelete(req.params.id)
    res.json({ message: 'Interview deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
