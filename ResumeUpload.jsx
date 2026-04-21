import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const ResumeUpload = () => {
  const [file, setFile] = useState(null)
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!file) {
      setError('Please select a resume file')
      return
    }

    if (!jobTitle || !jobDescription) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('jobTitle', jobTitle)
      formData.append('jobDescription', jobDescription)

      const response = await api.post('/interviews/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      navigate(`/interview-setup?interviewId=${response.data.interviewId}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resume')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6">Upload Resume</h1>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm sm:text-base">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Resume File</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-blue-500">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                {file ? (
                  <p className="text-green-600 text-sm sm:text-base">{file.name}</p>
                ) : (
                  <div>
                    <p className="text-gray-600 text-sm sm:text-base">Click to upload or drag and drop</p>
                    <p className="text-xs sm:text-sm text-gray-500">PDF, DOC or DOCX</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Developer"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm sm:text-base"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows="8"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm sm:text-base"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400 text-sm sm:text-base"
          >
            {loading ? 'Processing...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResumeUpload
