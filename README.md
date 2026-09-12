<!-- # React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project. -->











# FinanceTracker

A full-stack personal finance tracker for recording income and expenses, setting monthly category budgets, and reviewing spending analytics — built with the MERN stack.

## Features

- User authentication (register/login) with JWT-based sessions
- Transactions: create, edit, delete, search, filter, and sort income/expenses
- Budgets: per-category monthly limits compared against actual spending
- Analytics: spending trends, category breakdowns, and budget vs. actual comparisons
- Settings: currency and light/dark/system theme, persisted per user
- All data is scoped to the authenticated user and persisted in MongoDB

## Tech Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- React Router
- Recharts (charts)

**Backend**
- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication (jsonwebtoken, bcrypt)
- Helmet, CORS, express-rate-limit

**Database**
- MongoDB

## Project Structure

This repository contains both the frontend and backend:

- The **repository root** is the React/Vite frontend (`src/`, `package.json`, `vite.config.js`).
- The **`backend/`** directory is the separate Express API (its own `package.json`, `server.js`, routes/controllers/models).

Each has its own dependencies and its own `.env` file.

## Local Development

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install frontend dependencies (repository root)

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Configure environment variables

Copy each `.env.example` to `.env` and fill in the values.

**Root `.env`** (frontend):

VITE_API_BASE_URL=


**`backend/.env`** (backend):

MONGO_URI=
JWT_SECRET=
CLIENT_ORIGIN=
PORT=


### 5. Start the backend

```bash
cd backend
npm run dev
```

### 6. Start the frontend

In a separate terminal, from the repository root:

```bash
npm run dev
```

## Environment Variables Reference

**Frontend**
| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Base URL the frontend uses to reach the backend API |

**Backend**
| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign/verify authentication tokens |
| `CLIENT_ORIGIN` | Allowed frontend origin(s) for CORS (comma-separated for multiple) |
| `PORT` | Port the backend listens on (falls back to `5000` if unset) |