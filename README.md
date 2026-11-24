# BoardBuddy

A web-based boarding house tenant and rent management system in development.

## Current state

The React frontend has a responsive navigation layout, mock registration and login, role-based page navigation, and a sample dashboard. The backend and MySQL integration are not implemented yet. Do not use the mock accounts for real tenant data.

## Objectives

BoardBuddy is planned to support landlord and tenant authentication, rooms, tenant assignments, monthly billing and utilities, full and partial payments, maintenance requests, announcements, reminders, and a tenant portal.

## Technology

- Frontend: React, Vite, Tailwind CSS, Axios, React Router, Lucide React
- Planned backend: Node.js, Express, MySQL2, CORS, dotenv, bcrypt, JWT, nodemon
- Planned database: MySQL

## Project structure

- `frontend/`: current React application
- `backend/`: dependency lockfile and empty backend placeholders
- `backend/database/schema.sql`: empty placeholder; database schema is not available in this checkout

## Run the current frontend

1. Install Node.js, then run `cd frontend` and `npm ci` if dependencies are not already installed.
2. Run `npm run dev` and open the URL shown by Vite.
3. Run `npm run build` to verify the production build.

The current frontend uses local browser storage for demonstration accounts. `frontend/src/services/api.js` sets `USE_MOCK = true`. It does not connect to MySQL or a running API.

## Backend and database setup

Backend setup and database creation instructions will be added when the existing design and schema are confirmed. The current `backend/package.json` is incomplete, `backend/database/schema.sql` is empty, and there is no server entry point. `backend/.env.example` lists placeholder environment variable names for future setup. No database credentials or real tenant records belong in Git.

## Available functionality

- Mock landlord and tenant registration, login, logout, and protected navigation
- Sample landlord and tenant dashboard
- Placeholder pages for rooms, tenants, bills, payments, maintenance, announcements, and profile

See [PROGRESS.md](PROGRESS.md) for the development stage and next step.
