import { useState, useEffect } from 'react'
import api from '../services/api'

const AdminPanel = () => {
  const [users, setUsers] = useState([])
  const [interviews, setInterviews] = useState([])
  const [activeTab, setActiveTab] = useState('users')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'users') {
          const response = await api.get('/admin/users')
          setUsers(response.data)
        } else {
          const response = await api.get('/admin/interviews')
          setInterviews(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [activeTab])

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`)
        setUsers(users.filter(u => u._id !== userId))
      } catch (error) {
        alert('Failed to delete user')
      }
    }
  }

  const handleDeleteInterview = async (interviewId) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      try {
        await api.delete(`/admin/interviews/${interviewId}`)
        setInterviews(interviews.filter(i => i._id !== interviewId))
      } catch (error) {
        alert('Failed to delete interview')
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2 rounded font-semibold ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('interviews')}
          className={`px-6 py-2 rounded font-semibold ${
            activeTab === 'interviews'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Interviews
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : activeTab === 'users' ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">Role</th>
                <th className="px-6 py-4 text-left font-semibold">Joined</th>
                <th className="px-6 py-4 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Title</th>
                <th className="px-6 py-4 text-left font-semibold">User</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Score</th>
                <th className="px-6 py-4 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview) => (
                <tr key={interview._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{interview.jobTitle}</td>
                  <td className="px-6 py-4">{interview.userId.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${
                      interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {interview.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{interview.score || '-'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteInterview(interview._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
