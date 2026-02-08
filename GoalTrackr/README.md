# GoalTrackr

GoalTrackr is a full-stack goal management application built with:
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Headless UI
- **Backend**: Netlify Functions (Node.js)
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT-based auth with httpOnly cookies

## Features
- User registration and login
- Dashboard with goal statistics and recent activity
- Create, Read, Update, Delete (CRUD) for Goals
- Progress tracking with notes for each goal
- Responsive and modern UI

## Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Netlify account (for deployment)

## Setup

1. **Clone and Install Dependencies**
   ```bash
   # Install backend/root dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory (based on `.env.example`):
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

## Development

To run the application locally, it is best to use **Netlify CLI** to simulate the serverless functions environment.

1. **Install Netlify CLI globally**
   ```bash
   npm install -g netlify-cli
   ```

2. **Start Development Server**
   From the root directory:
   ```bash
   netlify dev
   ```
   This will start both the frontend (Vite) and backend functions, accessible at `http://localhost:8888`.

   *Note: If you don't use Netlify CLI, running `npm run dev` in `frontend` will NOT work for API calls because the functions won't be running.*

## Deployment

1. **Push to GitHub**
   Initialize a git repository and push your code to GitHub.

2. **Deploy to Netlify**
   - Log in to Netlify and "Import from Git".
   - Select your repository.
   - **Build Command**: `cd frontend && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Functions Directory**: `api` (Netlify should auto-detect from `netlify.toml`)

3. **Configure Environment Variables in Netlify**
   - Go to Site Settings > Environment Variables.
   - Add `MONGODB_URI` and `JWT_SECRET`.

4. **Deploy!**

## Project Structure
- `frontend/`: React application.
- `api/`: Backend serverless functions.
- `shared/`: Shared TypeScript types.
- `netlify.toml`: Netlify configuration.
