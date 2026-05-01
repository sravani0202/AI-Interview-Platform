const Interview = require('../models/Interview')
const { calculateScore } = require('../utils/helpers')

exports.getUserAnalytics = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.userId }).sort({ createdAt: -1 })
    
    const scores = interviews.map(i => calculateScore(i.answers))
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b) / scores.length) : 0
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0
    const improvementRate = scores.length > 1 ? 
      Math.round(((scores[0] - scores[scores.length - 1]) / scores[scores.length - 1]) * 100) : 0

    const scoreProgression = interviews.map((i, idx) => ({
      name: `Interview ${idx + 1}`,
      score: calculateScore(i.answers)
    }))

    const skillsAssessment = [
      { name: 'Communication', score: 78 },
      { name: 'Technical', score: 82 },
      { name: 'Problem Solving', score: 75 },
      { name: 'Time Management', score: 80 }
    ]

    const recommendations = [
      'Practice explaining complex concepts clearly',
      'Work on time management during interviews',
      'Improve technical depth in system design',
      'Prepare more behavioral examples'
    ]

    res.json({
      averageScore,
      totalInterviews: interviews.length,
      improvementRate,
      bestScore,
      scoreProgression,
      skillsAssessment,
      recommendations
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
