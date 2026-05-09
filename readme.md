# 🚀 Task Flow - Ethara AI Task Manager

A full-stack project management web app where users can create projects, assign tasks, and track progress using **role-based access control (Admin / Member)**.

🔗 Live Demo: https://task-flow-ether.up.railway.app/login

---

## 📌 Key Features

### 🔐 Authentication
- User Signup & Login
- Secure JWT-based authentication
- Role-based access (Admin / Member)

### 📁 Project Management
- Create and manage projects
- Assign team members to projects
- Organize work efficiently

### ✅ Task Management
- Create tasks inside projects
- Assign tasks to users
- Update task status (To Do / In Progress / Done)
- Track task deadlines and progress

### 📊 Dashboard
- View all tasks in one place
- Track project progress
- Highlight overdue tasks

---

## ⚙️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt.js

### 🗄️ Database
- MongoDB (NoSQL)
- Mongoose ODM

---

## 🗄️ Database Structure (MongoDB)

### Users Collection
- name
- email
- password (hashed)
- role (admin / member)

### Projects Collection
- title
- description
- createdBy (User ID)
- members (array of User IDs)

### Tasks Collection
- title
- description
- status (todo / in-progress / done)
- assignedTo (User ID)
- projectId (Project ID)
- dueDate

---

## 🔐 Roles

### 👑 Admin
- Create projects
- Assign members
- Create and assign tasks
- Manage all project data

### 👤 Member
- View assigned projects
- Work on assigned tasks
- Update task status

---

## 🚀 Deployment

- Hosted on Railway
- Full-stack deployed (Frontend + Backend)
- MongoDB Atlas used for database

🔗 Live App:  
https://task-flow-ether.up.railway.app/login

---

## 🛠️ Local Setup

```bash
# Clone repo
git clone https://github.com/Akshad999/EtharaAi.git

# Backend setup
cd backend
npm install
npm run dev

# Frontend setup
cd ../frontend
npm install
npm run dev
