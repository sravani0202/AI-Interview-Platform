import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'

// Pages
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import ResumeUpload from './pages/ResumeUpload'
import InterviewSetup from './pages/InterviewSetup'
import AIQuestionScreen from './pages/AIQuestionScreen'
import VideoRecordingScreen from './pages/VideoRecordingScreen'
import ResultsDashboard from './pages/ResultsDashboard'
import PerformanceAnalytics from './pages/PerformanceAnalytics'
import AdminPanel from './pages/AdminPanel'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              <Navbar />
              <Outlet />
            </div>
          </ThemeProvider>
        </AuthProvider>
      ),
      children: [
        { path: 'login', element: <Login /> },
        { path: 'signup', element: <Signup /> },
        { path: '', element: <PrivateRoute><Dashboard /></PrivateRoute> },
        { path: 'resume-upload', element: <PrivateRoute><ResumeUpload /></PrivateRoute> },
        { path: 'interview-setup', element: <PrivateRoute><InterviewSetup /></PrivateRoute> },
        { path: 'interview/:id/question', element: <PrivateRoute><AIQuestionScreen /></PrivateRoute> },
        { path: 'interview/:id/recording', element: <PrivateRoute><VideoRecordingScreen /></PrivateRoute> },
        { path: 'results/:id', element: <PrivateRoute><ResultsDashboard /></PrivateRoute> },
        { path: 'analytics', element: <PrivateRoute><PerformanceAnalytics /></PrivateRoute> },
        { path: 'admin', element: <PrivateRoute><AdminPanel /></PrivateRoute> },
        { path: '*', element: <Navigate to="/" replace /> }
      ]
    }
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    }
  }
)

function App() {
  return <RouterProvider router={router} />
}

export default App
