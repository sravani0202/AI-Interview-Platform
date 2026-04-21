const User = require('../models/User')
const Interview = require('../models/Interview')

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    // Also delete user's interviews
    await Interview.deleteMany({ userId: req.params.id })
    res.json({ message: 'User deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().populate('userId', 'name email')
    res.json(interviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id)
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' })
    }
    res.json({ message: 'Interview deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalInterviews = await Interview.countDocuments()
    const completedInterviews = await Interview.countDocuments({ status: 'completed' })
    
    res.json({
      totalUsers,
      totalInterviews,
      completedInterviews,
      avgScore: 75 // Mock data
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
