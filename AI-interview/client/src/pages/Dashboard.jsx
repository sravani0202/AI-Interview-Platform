import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const Dashboard = () => {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get('/interviews')
        setInterviews(response.data)
      } catch (error) {
        console.error('Failed to fetch interviews:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchInterviews()
  }, [])

  const handleDelete = async (interviewId) => {
    if (!window.confirm('Delete this in-progress interview? This action cannot be undone.')) return
    try {
      await api.delete(`/interviews/${interviewId}`)
      setInterviews(prev => prev.filter(interview => interview._id !== interviewId))
      setToastMessage('Deleted successfully')
      window.setTimeout(() => setToastMessage(''), 3500)
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete interview'
      alert(message)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-4xl font-bold">Dashboard</h1>
        <Link
          to="/resume-upload"
          className="w-full sm:w-auto text-center bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Start Interview
        </Link>
      </div>

      {toastMessage && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800 shadow-sm">
          {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-semibold">Total Interviews</h3>
          <p className="text-3xl font-bold mt-2">{interviews.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-semibold">Completed</h3>
          <p className="text-3xl font-bold mt-2">{interviews.filter(i => i.status === 'completed').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-semibold">In Progress</h3>
          <p className="text-3xl font-bold mt-2">{interviews.filter(i => i.status === 'in_progress').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold">Recent Interviews</h2>
        </div>

        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : interviews.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No interviews yet. <Link to="/resume-upload" className="text-blue-600">Start one now!</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Score</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((interview) => (
                  <tr key={interview._id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">{interview.jobTitle || interview.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded text-sm font-semibold ${
                        interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                        interview.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {interview.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{interview.score || '-'}</td>
                    <td className="px-6 py-4 space-y-2">
                      {interview.status === 'completed' && (
                        <Link to={`/results/${interview._id}`} className="text-blue-600 hover:underline block">
                          View Results
                        </Link>
                      )}
                      {interview.status === 'in_progress' && (
                        <button
                          onClick={() => handleDelete(interview._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
