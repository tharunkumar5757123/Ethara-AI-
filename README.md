# 📊 Team Task Manager

A full-stack web application for managing team projects and tasks collaboratively. Built with MERN stack (MongoDB, Express, React, Node.js).

## Features

- 👤 **User Authentication**: Secure signup and login with JWT tokens
- 📁 **Project Management**: Create projects and manage team members
- 📌 **Task Management**: Create, assign, and track task status in Kanban-style board
- 📊 **Dashboard**: View comprehensive statistics and overdue tasks
- 🔐 **Role-Based Access**: Admin (project creator) and Member roles
- 🚀 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- CSS3 for styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- CORS for cross-origin requests

### Deployment
- Railway (Backend + Frontend)
- MongoDB Atlas (Database)

## System Design

### Database Schema

**User Model**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: { type: String, enum: ["Admin", "Member"], default: "Member" },
  timestamps: true
}
```

**Project Model**
```javascript
{
  title: String,
  description: String,
  createdBy: ObjectId (User),
  members: [ObjectId (User)],
  timestamps: true
}
```

**Task Model**
```javascript
{
  title: String,
  description: String,
  dueDate: Date,
  priority: { type: String, enum: ["Low", "Medium", "High"] },
  status: { type: String, enum: ["To Do", "In Progress", "Done"] },
  assignedTo: ObjectId (User),
  projectId: ObjectId (Project),
  timestamps: true
}
```

## API Endpoints

### Authentication Routes
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Project Routes (Protected)
- `GET /api/projects` - Get all projects for current user
- `GET /api/projects/:id` - Get single project details
- `POST /api/projects` - Create new project (Admin only)
- `PUT /api/projects/:id` - Update project (Admin only)
- `DELETE /api/projects/:id` - Delete project (Admin only)
- `POST /api/projects/:id/add-member` - Add member to project (Admin only)
- `DELETE /api/projects/:id/remove-member/:memberId` - Remove member (Admin only)

### Task Routes (Protected)
- `GET /api/tasks/:projectId` - Get tasks for a project
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/dashboard` - Get dashboard statistics

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### Backend Setup

1. **Clone the repository and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```
   VITE_API_URL=http://localhost:5000
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   Application will open on `http://localhost:5173`

## Project Structure

```
Team Task Manager/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── adminOnly.js
│   ├── config/
│   │   └── db.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── Tasks.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── App.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## Features Walkthrough

### 1. Authentication
- Users can signup with name, email, and password
- Password is hashed using bcrypt
- JWT tokens are issued upon successful login
- Tokens are stored in localStorage on the client

### 2. Projects
- Admin users can create new projects
- Project creator automatically becomes an admin
- Admin can add/remove members from projects
- Members can view projects they're part of

### 3. Tasks
- Project admin can create tasks with title, description, due date, and priority
- Tasks can be assigned to any project member
- Task status can be changed (To Do → In Progress → Done)
- Members assigned to tasks can update their status

### 4. Dashboard
- Total task count
- Tasks grouped by status (To Do, In Progress, Done)
- Tasks per user statistics
- List of overdue tasks (due date passed, status not Done)

### 5. Kanban Board
- Visual task board with three columns
- Drag-and-drop status updates (if implemented)
- Priority color coding
- Due date indicators
- Quick task deletion

## Deployment on Railway

### Backend Deployment

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push origin main
   ```

2. **Connect to Railway**
   - Login to [Railway.app](https://railway.app)
   - Create a new project
   - Connect your GitHub repository
   - Select the backend folder as the root

3. **Add Environment Variables**
   - Go to Variables tab
   - Add:
     ```
     MONGO_URI=your_mongodb_atlas_uri
     JWT_SECRET=your_jwt_secret
     PORT=5000
     FRONTEND_URL=your_frontend_url
     ```

4. **Deploy**
   - Railway will auto-deploy on push
   - Get the backend URL from Railway dashboard

### Frontend Deployment

1. **Update API URL**
   - Update `VITE_API_URL` in `.env` to your Railway backend URL

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Deploy to Railway**
   - Create another project on Railway
   - Connect the same GitHub repo
   - Select the frontend folder
   - Railway will auto-build and serve

## Authentication Flow

1. User registers/logs in
2. Backend validates credentials and issues JWT token
3. Frontend stores token in localStorage
4. All subsequent API requests include token in Authorization header
5. Backend verifies token before processing requests
6. If token is invalid/expired, user is redirected to login

## Error Handling

- All API endpoints return appropriate HTTP status codes
- Error messages are descriptive
- Frontend displays user-friendly error notifications
- Invalid tokens redirect user to login

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes with middleware
- CORS configuration for secure cross-origin requests
- Environment variables for sensitive data

## Future Enhancements

- Real-time notifications
- Task comments and attachments
- Team workspace/organization support
- Email notifications for task assignments
- Drag-and-drop task management
- Advanced filtering and search
- Team member invite system
- Task templates

## Demo

### User Registration & Login
1. Go to signup page
2. Enter name, email, password
3. Account is created and user is logged in
4. Redirect to dashboard

### Project Creation
1. Navigate to Projects page
2. Click "New Project"
3. Enter project details
4. Project is created and you become admin

### Task Management
1. Click "View Tasks" on a project
2. Click "New Task" to create task
3. Fill in task details and assign to team member
4. View tasks in Kanban board
5. Drag tasks between columns or use dropdown to change status

### Dashboard
1. View overall statistics
2. See task distribution by status
3. Check overdue tasks
4. Monitor team member workload

## Support

For issues or questions, please create an issue on GitHub repository.

## License

This project is licensed under the MIT License.

---

**Built with ❤️ for Team Collaboration**
