# AI Interview Platform - MERN Stack

A comprehensive AI-powered interview preparation platform built with the MERN stack (MongoDB, Express, React, Node.js) featuring resume parsing, AI question generation, voice recording, and performance analytics.

## Features

### Frontend (React + Tailwind CSS)
- **Authentication**: Login/Signup with JWT
- **Dashboard**: Overview of interviews and progress
- **Resume Upload**: Upload resume and select job details
- **Interview Setup**: Configure difficulty and duration
- **AI Question Screen**: Answer AI-generated questions
- **Voice Recording**: Record spoken answers
- **Results Dashboard**: View detailed interview results
- **Performance Analytics**: Track progress with charts
- **Admin Panel**: Manage users and interviews

### Backend (Node + Express)
- **User Authentication**: JWT-based authentication with bcrypt
- **Resume Parsing**: Extract skills and experience
- **Question Generation**: AI-powered question generation
- **Interview Management**: Create, update, and track interviews
- **Speech Analysis**: Process and evaluate voice responses
- **Performance Tracking**: Analytics and feedback system
- **Admin Controls**: User and interview management

## Project Structure

```
newproject/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── services/       # API services
│   │   ├── context/        # Auth context
│   │   └── App.jsx         # Main app component
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
└── server/                  # Express Backend
    ├── models/             # MongoDB schemas
    ├── routes/             # API routes
    ├── controllers/        # Route controllers
    ├── middlewares/        # Custom middleware
    ├── utils/              # Helper functions
    ├── server.js           # Main server file
    └── package.json
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-interview
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
OPENAI_API_KEY=your_openai_key_here
```

5. Start the server:
```bash
npm start       # Production
npm run dev     # Development with nodemon
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Interviews
- `GET /api/interviews` - Get user's interviews
- `POST /api/interviews/create` - Create new interview
- `GET /api/interviews/:id` - Get interview details
- `PUT /api/interviews/:id` - Update interview
- `GET /api/interviews/:id/question/:index` - Get question
- `POST /api/interviews/:id/answer` - Submit answer
- `POST /api/interviews/:id/submit-media` - Submit video/audio response
- `GET /api/interviews/:id/results` - Get interview results

### Admin
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/interviews` - Get all interviews
- `DELETE /api/admin/interviews/:id` - Delete interview
- `GET /api/admin/stats` - Get dashboard stats

### Analytics
- `GET /api/analytics/performance` - Get user performance analytics

## Technologies Used

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Axios
- Recharts
- Chart.js

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer
- bcryptjs

## Features in Detail

### Interview Flow
1. User logs in or signs up
2. Uploads resume and selects job position
3. Configures interview difficulty and duration
4. Answers AI-generated questions
5. Can optionally record voice responses
6. Receives detailed feedback and scoring
7. Views analytics and improvement recommendations

### AI Features
- Resume parsing to extract relevant skills
- Intelligent question generation based on job and difficulty
- Answer evaluation and scoring
- Personalized feedback and recommendations

### Admin Features
- User management
- Interview monitoring
- Platform statistics
- User deletion and interview cleanup

## Database Schema

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String (user/admin),
  createdAt: Date
}
```

### Interview
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref User),
  jobTitle: String,
  jobDescription: String,
  resumePath: String,
  difficulty: String,
  status: String,
  questions: Array,
  answers: Array,
  score: Number,
  createdAt: Date
}
```

## Future Enhancements

- [ ] Integration with OpenAI for advanced question generation
- [ ] Real-time video recording and analysis
- [ ] Sentiment analysis for behavioral questions
- [ ] Mock interview with other users
- [ ] Detailed skill assessment reports
- [ ] Mobile application
- [ ] Advanced resume parsing with NLP
- [ ] Email notifications
- [ ] Interview scheduling
- [ ] Company-specific question banks

## Contributing

Feel free to fork, modify, and contribute to this project!

## License

MIT License

## Support

For issues or questions, please open an issue in the repository.
