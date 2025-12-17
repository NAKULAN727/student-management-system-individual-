# Eluria School of Excellence - Management System

A full-stack School Management System built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running locally on port 27017 (or update `.env`)

### 1️⃣ Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Start the backend server:

```bash
npm run dev
```

The server will run on `http://localhost:5000`.

### 2️⃣ Frontend Setup

Open a new terminal, navigate to the client directory:

```bash
cd client
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 🛠️ Features

- **Role-Based Access**: Student, Teacher, Parent, Admin.
- **Modern UI**: Blue & White theme with smooth animations (Framer Motion).
- **Authentication**: Secure JWT login with role verification.
- **Dashboards**: Dedicated panels for each user type.

## 🔐 Default Login (for testing)

You can register a new user via Postman or modify the Login page to allow registration.
For the demo, the API allows public registration at `/api/auth/register`.

## 📁 Project Structure

- **/client**: React Frontend (Vite + Tailwind)
- **/server**: Node.js Backend (Express + MongoDB)
