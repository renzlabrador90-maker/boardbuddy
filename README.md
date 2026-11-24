# BoardBuddy

A web-based boarding house tenant and rent management system in development.

## Current state

The React frontend has a responsive navigation layout, mock registration and login, role-based page navigation, and a sample dashboard. A basic Express server exposes a health endpoint; authentication, application APIs, and MySQL integration are not implemented yet. Do not use the mock accounts for real tenant data.

## Objectives

BoardBuddy is planned to support landlord and tenant authentication, rooms, tenant assignments, monthly billing and utilities, full and partial payments, maintenance requests, announcements, reminders, and a tenant portal.

## Technology

- Frontend: React, Vite, Tailwind CSS, Axios, React Router, Lucide React
- Backend dependencies: Node.js, Express, MySQL2, CORS, dotenv, bcrypt, JWT, nodemon
- Planned database: MySQL

## Project structure

- `frontend/`: current React application
- `backend/`: Express health endpoint, dependency files, and empty route placeholders
- `backend/database/schema.sql`: empty placeholder; database schema has not been created yet

## Run the current frontend

1. Install Node.js, then run `cd frontend` and `npm ci` if dependencies are not already installed.
2. Run `npm run dev` and open the URL shown by Vite.
3. Run `npm run build` to verify the production build.

The current frontend uses local browser storage for demonstration accounts. `frontend/src/services/api.js` sets `USE_MOCK = true`. It does not connect to MySQL or a running API.

## Run the backend foundation

Run `cd backend` and `npm run dev`. Open `http://localhost:5000/api/health`; it should return `{"status":"ok","service":"BoardBuddy API"}`. The dependencies are already installed in this workspace. On another computer, run `npm ci` first.

The health endpoint does not need a database or environment file. For future configuration, copy `backend/.env.example` to `backend/.env` and fill in local values. Keep `.env` out of Git. MySQL setup instructions will be added when the schema is created. No database credentials or real tenant records belong in Git.

## Available functionality

- Mock landlord and tenant registration, login, logout, and protected navigation
- Sample landlord and tenant dashboard
- Placeholder pages for rooms, tenants, bills, payments, maintenance, announcements, and profile

See [PROGRESS.md](PROGRESS.md) for the development stage and next step.
