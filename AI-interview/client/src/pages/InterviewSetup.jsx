import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

const InterviewSetup = () => {
  const [searchParams] = useSearchParams()
  const [interview, setInterview] = useState(null)
  const [difficulty, setDifficulty] = useState('medium')
  const [duration, setDuration] = useState('30')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const interviewId = searchParams.get('interviewId')

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await api.get(`/interviews/${interviewId}`)
        setInterview(response.data)
      } catch (error) {
        console.error('Failed to fetch interview:', error)
      }
    }
    if (interviewId) {
      fetchInterview()
    }
  }, [interviewId])

  const handleStart = async () => {
    setLoading(true)
    try {
      await api.put(`/interviews/${interviewId}`, {
        difficulty,
        duration: parseInt(duration),
        status: 'in_progress'
      })
      navigate(`/interview/${interviewId}/question`)
    } catch (error) {
      console.error('Failed to start interview:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!interview) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-8">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Interview Setup</h1>

        <div className="mb-8 p-4 bg-blue-50 rounded">
          <h2 className="font-semibold text-gray-800">Interview Details</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base"><strong>Position:</strong> {interview.jobTitle}</p>
          <p className="text-gray-600 text-sm sm:text-base"><strong>Resume:</strong> Uploaded successfully</p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-3 text-sm sm:text-base">Difficulty Level</label>
          <div className="flex flex-wrap gap-4">
            {['easy', 'medium', 'hard'].map((level) => (
              <label key={level} className="flex items-center">
                <input
                  type="radio"
                  value={level}
                  checked={difficulty === level}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="mr-2"
                />
                <span className="capitalize text-sm sm:text-base">{level}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-3 text-sm sm:text-base">Interview Duration (minutes)</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm sm:text-base"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </div>

        <div className="bg-yellow-50 p-4 rounded mb-6">
          <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Before you start:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ Ensure you're in a quiet environment</li>
            <li>✓ Check your microphone and speakers</li>
            <li>✓ Have your camera ready (optional)</li>
            <li>✓ Make sure you have a stable internet connection</li>
          </ul>
        </div>

        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 disabled:bg-gray-400 text-sm sm:text-base"
        >
          {loading ? 'Starting...' : 'Start Interview'}
        </button>
      </div>
    </div>
  )
}

export default InterviewSetup
