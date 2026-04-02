<div align="center">

# Flowlytics

### A Modern Full-Stack Finance Dashboard

*Track income, expenses, and financial insights with a sleek, role-based analytics platform.*

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-FB015B?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Scripts](#scripts)
- [Mock Data](#mock-data)
- [License](#license)

---

## Overview

**Flowlytics** is a full-stack finance dashboard application that provides users with a comprehensive view of their financial data through interactive charts, transaction management, and smart insights. It features JWT-based authentication with role-based access control — **Admins** get full CRUD capabilities while **Users** (viewers) get a read-only experience.

---

## Features

### Authentication & Security
- **Login / Sign Up** — Beautiful glassmorphism auth page with animated logo
- **JWT Authentication** — Secure token-based auth with 7-day expiry
- **Role Selection** — Choose Admin or User role during registration
- **Password Hashing** — bcrypt with 12 salt rounds
- **Auto Token Verification** — Validates stored token on app mount
- **Protected Routes** — Unauthenticated users see only the login page

### Dashboard Overview
- **Summary Cards** — Total Balance, Income, Expenses, and Transaction Count at a glance
- **Income vs Expenses Chart** — Area chart showing monthly trends over the past 6 months
- **Spending Breakdown** — Donut chart with category-wise expense distribution
- **Recent Transactions** — Quick view of the latest 5 transactions

### Transactions
- Full transaction list with **pagination** (15 per page)
- **Search** by description or category
- **Filter** by type (income/expense), category, and date range
- **Sort** by date or amount (click column headers)
- **Add / Edit / Delete** transactions (admin role only)
- **CSV Export** of filtered results

### Insights
- Highest spending category identification
- Savings rate calculation
- Average transaction amounts
- Month-over-month comparison (income & expense % change)
- Expense categories ranked with visual progress bars
- Notable transactions (largest income & expense)

### Role-Based Access Control
- **Admin** — Full access: can add, edit, and delete transactions
- **Viewer (User)** — Read-only: can view all data but cannot modify
- Role is assigned at registration and enforced from the server

### Additional Features
- **Dark Mode** with toggle and localStorage persistence
- **Responsive Design** — works on mobile, tablet, and desktop
- **Data Persistence** — transactions, auth tokens, and preferences saved to localStorage
- **Animated Logo** — Custom SVG logo with animated bars, flowing waves, and particles
- **Error Boundary** — Catches and recovers from unexpected React errors
- **Empty State Handling** — Graceful UI when no data is available
- **Smooth Transitions** — Hover effects, backdrop blur, and animated charts

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend | React | 18.3 | UI framework |
| Build Tool | Vite | 6 | Dev server & bundler |
| Styling | Tailwind CSS | v4 | Utility-first CSS |
| State | Zustand | 5 | State management with persist middleware |
| Charts | Recharts | 2.15 | Area, Pie, and Bar charts |
| Icons | Lucide React | 0.468 | Modern icon library |
| Backend | Express.js | 4.21 | REST API server |
| Database | MongoDB + Mongoose | 8.9 | NoSQL data storage & ODM |
| Auth | JSON Web Tokens | 9.0 | Token-based authentication |
| Security | bcryptjs | 2.4 | Password hashing (12 salt rounds) |
| HTTP | CORS | 2.8 | Cross-origin request handling |
| Config | dotenv | 16.4 | Environment variable management |

---

## Project Structure

```
Finance Dashboard UI/
├── server/                           # Backend (Express + MongoDB)
│   ├── models/
│   │   └── User.js                   # Mongoose user schema, bcrypt hashing
│   ├── routes/
│   │   └── auth.js                   # Register, Login, Token verification
│   ├── .env                          # Environment variables
│   ├── index.js                      # Express entry point, MongoDB connection
│   └── package.json                  # Backend dependencies
│
├── src/                              # Frontend (React)
│   ├── components/
│   │   ├── AnimatedLogo.jsx          # SVG animated logo with particles
│   │   ├── BalanceTrendChart.jsx     # Area chart – income vs expenses
│   │   ├── ErrorBoundary.jsx         # React error boundary wrapper
│   │   ├── Header.jsx               # Top bar with page title, role badge, avatar
│   │   ├── RecentTransactions.jsx    # Latest 5 transactions display
│   │   ├── Sidebar.jsx              # Navigation, user info, logout, dark mode
│   │   ├── SpendingBreakdownChart.jsx # Donut chart – spending by category
│   │   └── SummaryCards.jsx          # Balance, income, expense, count cards
│   ├── pages/
│   │   ├── AuthPage.jsx             # Login/Sign Up with role selection
│   │   ├── DashboardPage.jsx        # Main dashboard overview
│   │   ├── TransactionsPage.jsx     # Transaction list with CRUD & filters
│   │   └── InsightsPage.jsx         # Analytics and financial insights
│   ├── store/
│   │   └── useStore.js              # Zustand store (auth, transactions, UI)
│   ├── data/
│   │   └── mockData.js              # 120 mock transactions generator
│   ├── App.jsx                      # Root layout, auth guard, page routing
│   ├── main.jsx                     # Entry point, localStorage validation
│   └── index.css                    # Tailwind imports, dark mode config
│
├── index.html                        # HTML entry point
├── vite.config.js                    # Vite config with Tailwind & API proxy
├── package.json                      # Frontend dependencies & scripts
└── README.md                         # This file
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** running locally or a remote connection URI

### 1. Clone the Repository

```bash
git clone <repo-url>
cd "Finance Dashboard UI"
```

### 2. Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..
```

### 3. Configure Environment Variables

Create or edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/flowlytics
JWT_SECRET=your_secure_secret_key_here
```

> **Note:** Replace `JWT_SECRET` with a strong random string in production.

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
mongod
```

### 5. Start the Application

Open **two terminals**:

```bash
# Terminal 1 — Backend server
cd server
npm run dev
# → Server running on port 5000
# → Connected to MongoDB
```

```bash
# Terminal 2 — Frontend dev server
npm run dev
# → http://localhost:5173
```

The Vite dev server automatically proxies `/api` requests to the backend at `http://localhost:5000`.

### 6. Build for Production

```bash
npm run build
npm run preview
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Backend server port |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/flowlytics` | MongoDB connection string |
| `JWT_SECRET` | — | Secret key for signing JWT tokens |

---

## API Endpoints

All routes are prefixed with `/api`.

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/api/auth/register` | Create a new account | No |
| `POST` | `/api/auth/login` | Sign in and receive JWT | No |
| `GET` | `/api/auth/me` | Verify token & get user info | Yes (Bearer) |
| `GET` | `/api/health` | Server health check | No |

### Register Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "admin"
}
```

### Login Request Body

```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

### Success Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "createdAt": "..."
  }
}
```

---

## Scripts

### Frontend (`package.json`)

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start development server with HMR |
| `build` | `vite build` | Create optimized production build |
| `preview` | `vite preview` | Preview the production build locally |

### Backend (`server/package.json`)

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `node index.js` | Start Express server |

---

## Mock Data

The app ships with **120 pre-generated transactions** spanning October 2025 – April 2026:

| Category Type | Categories | Amount Range |
|--------------|------------|-------------|
| **Income** | Salary, Freelance, Investment, Other Income | $100 – $8,000 |
| **Expense** | Food & Dining, Transportation, Shopping, Entertainment, Bills & Utilities, Healthcare, Education, Travel | $5 – $500 |

- **Distribution:** ~70% expenses, ~30% income
- **Data is generated at runtime** — each session starts with fresh realistic data
- Transactions persist to localStorage after first load

---

## Design Decisions

- **Zustand** for state management — minimal boilerplate, built-in `persist` middleware for localStorage, individual selectors prevent unnecessary re-renders
- **No client-side router** — simple page state in the Zustand store avoids complexity for a 3-page SPA
- **Tailwind CSS v4** with `@tailwindcss/vite` plugin — zero-config, class-based dark mode via `@custom-variant`
- **JWT auth with role from server** — role is assigned during registration and stored in MongoDB, not just toggled on the frontend
- **Vite proxy** — `/api` routes forwarded to Express during development, no CORS issues
- **React 18** — downgraded from 19 for Recharts compatibility (`react-transition-group` uses `findDOMNode`)
- **Standalone derived functions** — `getSummary()` and `getFilteredTransactions()` extracted outside the Zustand store and used with `useMemo` to avoid infinite re-render loops

---

## License

This project is for educational and portfolio purposes.
