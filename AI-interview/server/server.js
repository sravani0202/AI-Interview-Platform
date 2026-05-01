require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const path = require('path')
const fs = require('fs')

const authRoutes = require('./routes/auth')
const interviewRoutes = require('./routes/interviews')
const adminRoutes = require('./routes/admin')
const analyticsRoutes = require('./routes/analytics')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('combined'))

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Increased from 20 to 50
  message: { message: 'Too many requests from this IP, please try again later.' }
})

app.use('/api/auth', authRateLimiter)

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads')
}

app.use('/uploads', express.static('uploads'))

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-interview')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/interviews', interviewRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/analytics', analyticsRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: err.message })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
