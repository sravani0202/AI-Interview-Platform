import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'

const ResultsDashboard = () => {
  const { id } = useParams()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get(`/interviews/${id}/results`)
        setResults(response.data)
      } catch (error) {
        console.error('Failed to fetch results:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [id])

  if (loading) {
    return <div className="text-center py-8">Loading results...</div>
  }

  if (!results) {
    return <div className="text-center py-8">Results not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Interview Results</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-sm font-semibold">Overall Score</p>
          <p className="text-5xl font-bold text-blue-600 mt-2">{results.score}%</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-sm font-semibold">Questions Answered</p>
          <p className="text-5xl font-bold text-green-600 mt-2">{results.questionsAnswered}/{results.totalQuestions}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-sm font-semibold">Duration</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">{results.duration} min</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Detailed Feedback</h2>
        <div className="space-y-4">
          {results.feedback.map((item, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-semibold text-gray-800">Q{index + 1}: {item.question}</p>
              <p className="text-gray-600 mt-2"><strong>Your Answer:</strong> {item.userAnswer}</p>
              <p className="text-gray-600 mt-1"><strong>Feedback:</strong> {item.feedback}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-gray-500">Score:</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold">{item.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => window.location.href = '/'}
          className="flex-1 bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 bg-gray-600 text-white py-3 rounded font-semibold hover:bg-gray-700"
        >
          Download Report
        </button>
      </div>
    </div>
  )
}

export default ResultsDashboard
