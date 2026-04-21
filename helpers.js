const jwt = require('jsonwebtoken')

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured. Add JWT_SECRET to server/.env')
  }

  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  )
}

const parseResume = (resumeText) => {
  // Basic resume parsing - in production, use dedicated library like pdfjs or similar
  const skills = []
  const experience = []
  
  // Extract common technical skills
  const skillPatterns = ['javascript', 'python', 'java', 'react', 'node', 'sql', 'mongodb', 'aws', 'docker']
  skillPatterns.forEach(skill => {
    if (resumeText.toLowerCase().includes(skill)) {
      skills.push(skill)
    }
  })

  return { skills, experience }
}

const generateQuestions = (jobTitle, difficulty = 'medium', resume = {}) => {
  // Mock question generation - in production, integrate with OpenAI API
  const questionBank = {
    technical: {
      easy: [
        { text: 'What is your experience with the main tech stack for this role?', hint: 'Mention your experience level' },
        { text: 'Describe a recent project where you used relevant technologies.', hint: 'Focus on outcomes' }
      ],
      medium: [
        { text: 'How would you approach optimizing a slow database query?', hint: 'Consider indexing and query structure' },
        { text: 'Explain a complex technical decision you made in your last project.', hint: 'Walk through your reasoning' }
      ],
      hard: [
        { text: 'Design a system to handle millions of concurrent users.', hint: 'Consider scalability and bottlenecks' },
        { text: 'How would you implement microservices in this architecture?', hint: 'Think about communication and data consistency' }
      ]
    },
    behavioral: [
      { text: 'Tell me about a time you had to work with a difficult team member.', hint: 'Describe the situation, action, and result' },
      { text: 'Give an example of when you had to learn something new quickly.', hint: 'Focus on your learning process' },
      { text: 'Describe a failure and what you learned from it.', hint: 'Be honest and show growth' }
    ]
  }

  const questions = [
    ...questionBank.technical[difficulty].slice(0, 2),
    ...questionBank.behavioral.slice(0, 1)
  ]

  return questions
}

const calculateScore = (answers) => {
  if (!answers || answers.length === 0) return 0
  const total = answers.reduce((sum, answer) => sum + (answer.score || 0), 0)
  return Math.round(total / answers.length)
}

module.exports = {
  generateToken,
  parseResume,
  generateQuestions,
  calculateScore
}
