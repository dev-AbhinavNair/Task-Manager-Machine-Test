# Task Manager

A full-stack task management app built with the MERN stack. Users can register, log in with an OTP sent to their email, and manage their tasks.

## Tech Stack

- **Backend**: Express 5, Mongoose 9, JWT (access + refresh tokens), Nodemailer
- **Frontend**: React 19, Vite 8, Tailwind CSS 4, React Router 7, Axios

## Setup

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and proxies API requests to `http://localhost:5000`.

## How it works

- Register with your name and email
- An OTP is sent to your email — enter it to log in
- Create, edit, and delete tasks from the dashboard
- Filter tasks by status: To Do, In Progress, Done
