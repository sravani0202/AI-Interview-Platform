# Backend Documentation

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the server directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-interview
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Start MongoDB
Make sure MongoDB is running locally or update MONGODB_URI with your MongoDB Atlas connection string.

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### 4. Start the Server
```bash
npm start       # Production mode
npm run dev     # Development mode with auto-reload
```

Server will run on `http://localhost:5000`

## API Testing

You can test the API using:
- Postman
- Thunder Client
- cURL
- REST Client VS Code extension

### Example Login Request
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

## Key Features Implemented

### Authentication
- JWT token-based authentication
- Password hashing with bcryptjs
- Protected routes with auth middleware

### Interview Management
- Create interviews with resume upload
- Generate questions based on difficulty
- Store and evaluate answers
- Calculate scores based on responses

### Admin Features
- View all users and interviews
- Delete users and interviews
- Dashboard statistics

### Analytics
- User performance tracking
- Score progression visualization
- Skill assessment
- Improvement recommendations

## Middleware

- **auth.js**: JWT token verification
- **upload.js**: File upload handling for resumes and audio

## Controllers

- **authController.js**: Signup, login, get current user
- **interviewController.js**: Interview CRUD and question management
- **adminController.js**: Admin operations
- **analyticsController.js**: Performance analytics

## Models

- **User**: User account and authentication
- **Interview**: Interview sessions and responses
- **Question**: Question bank
- **Feedback**: Interview feedback and scoring

## Next Steps

1. Replace mock question generation with OpenAI API
2. Implement resume parsing with pdf-parse or similar
3. Add speech-to-text conversion for audio responses
4. Integrate NLP for answer evaluation
5. Add email notifications
6. Implement real-time interview updates with WebSockets
