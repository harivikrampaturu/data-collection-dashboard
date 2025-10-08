# Data Collection Admin Dashboard

A modern React-based admin dashboard for managing the Data Collection microservices system. Built with React, Zustand for state management, Axios for API calls, and Ant Design for UI components.

## Features

### 🔐 Authentication
- Secure login system
- Token-based authentication
- Automatic token validation
- Persistent login sessions

### 📊 Dashboard
- Real-time statistics overview
- User and task metrics
- Recent activity monitoring
- Quick access to key features

### 👥 User Management
- View all registered users
- Edit user profiles and information
- Block/unblock users
- Delete user accounts
- User verification status tracking

### 📋 Task Management
- Create, edit, and delete tasks
- Task status and priority management
- Points system for tasks
- Due date tracking
- Task categorization

### 📝 Task Response Management
- View task responses by task
- Update response status (pending, approved, rejected)
- Review submitted media files
- Response analytics

### 🔔 Notifications & Communications
- Send push notifications to users
- Email communication system
- Targeted messaging capabilities
- Communication guidelines

## API Integration

The dashboard integrates with the following microservices:

### Authentication Service (Port: 8501)
- **Public Routes:**
  - `POST /authentication/users` - Create user
  - `POST /authentication/login` - Login
  - `POST /authentication/accept-invite` - Accept invitation
  - `POST /authentication/send-otp` - Send OTP
  - `POST /authentication/verify-otp` - Verify OTP

- **Protected Routes:**
  - `GET /auth/v1/me` - Get profile details
  - `GET /auth/v1/users` - List all users
  - `PATCH /auth/v1/users/:userId/user-profile` - Update user profile
  - `PATCH /auth/v1/users/:userId/block` - Block user
  - `PATCH /auth/v1/users/:userId/unblock` - Unblock user
  - `DELETE /auth/v1/users/:userId` - Delete user

### Task Service (Port: 8504)
- `GET /task/v1/tasks` - List tasks
- `POST /task/v1/tasks` - Create task (admin only)
- `PATCH /task/v1/tasks/:taskId` - Update task (admin only)
- `DELETE /task/v1/tasks/:taskId` - Delete task (admin only)
- `GET /task/v1/tasks/:taskId/respond` - List task responses (admin only)
- `PATCH /task/v1/tasks/responses/:responseId/status` - Update response status (admin only)

### Email Service (Port: 8503)
- `POST /email/v1/send-invite` - Send invitation
- `POST /email/v1/send-otp` - Send OTP

### Notification Service (Port: 8502)
- `POST /notification/v1/send` - Send notification

## Technology Stack

- **Frontend:** React 18
- **State Management:** Zustand
- **HTTP Client:** Axios
- **UI Framework:** Ant Design
- **Routing:** React Router DOM
- **Date Handling:** Day.js

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Running microservices backend

### Installation

1. Navigate to the dashboard directory:
```bash
cd data-collection-dashboard
```

2. Install dependencies:
```bash
npm install
```

**Note**: The project uses `country-state-city` package for real location data. If you encounter any issues with location data, ensure this package is properly installed.

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the dashboard

### Environment Setup

Make sure the following microservices are running:
- API Gateway: `http://localhost:8500`
- Authentication Service: `http://localhost:8501`
- Task Service: `http://localhost:8504`
- Email Service: `http://localhost:8503`
- Notification Service: `http://localhost:8502`

## Project Structure

```
src/
├── components/           # React components
│   ├── Dashboard.js     # Main dashboard view
│   ├── Users.js        # User management
│   ├── Tasks.js        # Task management
│   ├── TaskResponses.js # Task response management
│   ├── Notifications.js # Communication features
│   ├── Login.js        # Authentication
│   └── Layout.js       # App layout
├── store/              # Zustand stores
│   ├── authStore.js    # Authentication state
│   └── dashboardStore.js # Dashboard data state
├── services/           # API services
│   └── api.js         # Axios configuration
└── App.js             # Main app component
```

## Usage

### Login
1. Use admin credentials to log in
2. The system will validate your token automatically
3. Session is persisted across browser refreshes

### User Management
- View all registered users in a paginated table
- Edit user information including profile details
- Block/unblock users as needed
- Delete user accounts when necessary

### Task Management
- Create new tasks with title, description, priority, and points
- Edit existing tasks
- Set task status (active, inactive, completed)
- Delete tasks when no longer needed

### Task Response Management
- Select a task to view all responses
- Update response status (pending, approved, rejected)
- View detailed response information including media files
- Track response analytics

### Notifications
- Send push notifications to users
- Send emails to specific users
- Target different user groups
- Follow communication best practices

## State Management

The application uses Zustand for state management with two main stores:

### AuthStore
- Manages authentication state
- Handles login/logout
- Token validation
- User session persistence

### DashboardStore
- Manages all dashboard data
- API integration for all services
- CRUD operations for users, tasks, and responses
- Statistics and analytics

## API Configuration

The API client is configured in `src/services/api.js`:
- Base URL points to the API Gateway
- Automatic token injection
- Error handling for 401 responses
- Request/response interceptors

## Security Features

- Token-based authentication
- Automatic token refresh
- Secure API communication
- Role-based access control
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Data Collection System and follows the same licensing terms.
