# Frontend Documentation

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file with:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm run preview
```

## Project Structure

### /src/pages
- **Login.jsx**: User login page
- **Signup.jsx**: User registration
- **Dashboard.jsx**: Main dashboard with interview list
- **ResumeUpload.jsx**: Resume and job details upload
- **InterviewSetup.jsx**: Configure interview settings
- **AIQuestionScreen.jsx**: Answer questions
- **VideoRecordingScreen.jsx**: Record video/audio responses
- **ResultsDashboard.jsx**: View interview results
- **PerformanceAnalytics.jsx**: Analytics and charts
- **AdminPanel.jsx**: Admin user/interview management

### /src/components
- **Navbar.jsx**: Navigation bar with user info
- **PrivateRoute.jsx**: Protected route component

### /src/services
- **api.js**: Axios instance with JWT interceptors

### /src/context
- **AuthContext.jsx**: Authentication state management

## Key Features

### Authentication
- Login/Signup with JWT tokens
- Automatic token refresh
- Protected routes
- Persistent login with localStorage

### Interview Flow
1. Upload resume and job details
2. Configure interview settings
3. Answer AI-generated questions
4. Optional voice recording
5. View detailed results and feedback

### UI Components
- Built with Tailwind CSS
- Responsive design
- Clean and modern interface
- Form validation

### Charts and Analytics
- Score progression line chart
- Skills assessment bar chart
- Performance metrics
- Improvement recommendations

## Important Notes

1. **API Integration**: Make sure backend is running on `http://localhost:5000`
2. **File Uploads**: Resume and audio files are uploaded to the backend
3. **Token Storage**: JWT token is stored in localStorage
4. **CORS**: Backend must have CORS enabled for `http://localhost:3000`

## Troubleshooting

### CORS Errors
- Ensure backend has CORS enabled
- Check if API_URL in .env matches backend URL

### Login Issues
- Verify backend is running
- Check username/password in backend
- Check network tab in browser dev tools

### File Upload Issues
- Check file size limits (50MB set in backend)
- Ensure multipart/form-data is being sent

## Next Steps

1. Implement actual AI question generation
2. Add real speech-to-text conversion
3. Implement advanced answer evaluation
4. Add video recording capability
5. Implement real-time interview features
6. Add mobile responsiveness testing
