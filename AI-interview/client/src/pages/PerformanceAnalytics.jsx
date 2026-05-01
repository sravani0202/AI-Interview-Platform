import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import api from '../services/api'

const PerformanceAnalytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics/performance')
        setAnalytics(response.data)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>
  }

  if (!analytics) {
    return <div className="text-center py-8">No analytics data available</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Performance Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm font-semibold">Average Score</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{analytics.averageScore}%</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm font-semibold">Total Interviews</p>
          <p className="text-4xl font-bold text-green-600 mt-2">{analytics.totalInterviews}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm font-semibold">Improvement Rate</p>
          <p className="text-4xl font-bold text-purple-600 mt-2">{analytics.improvementRate}%</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm font-semibold">Best Score</p>
          <p className="text-4xl font-bold text-orange-600 mt-2">{analytics.bestScore}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Score Progression</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.scoreProgression}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Skills Assessment</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.skillsAssessment}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Recommendations</h2>
        <ul className="space-y-3">
          {analytics.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default PerformanceAnalytics
