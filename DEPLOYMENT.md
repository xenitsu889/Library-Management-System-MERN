# Deployment Guide

This project is best deployed as two services:

- Backend API: Node.js/Express service
- Frontend: React static site

## Render + Netlify Blueprint

The cleanest split deployment for this repo is:

- Render for the backend API
- Netlify for the frontend React app

### Render Blueprint

Use the root-level [render.yaml](render.yaml) file to create the backend service.

### Netlify Config

Use the root-level [netlify.toml](netlify.toml) file to deploy the frontend as a static site.

## Recommended Host: Render

### 1) Prepare MongoDB Atlas

- Keep the Atlas database name as `library-management-2`
- Whitelist the deploy host if you want to lock access down later; for initial testing you can allow all IPs
- Copy the Atlas connection string for the backend `MONGO_URL`

### 2) Deploy the backend

- Create a new Render Web Service
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables:
  - `MONGO_URL` = your Atlas connection string
  - `PORT` = leave unset if the platform assigns it automatically

After deployment, note the backend URL, for example `https://your-backend.onrender.com`.

### 3) Deploy the frontend

- Create a new Netlify site from the repository
- Netlify will use `frontend` as the base directory and `npm run build` as the build command because of [netlify.toml](netlify.toml)
- Set the environment variable:
  - `REACT_APP_API_URL` = your backend URL with a trailing slash, for example `https://your-backend.onrender.com/`

If you prefer to keep everything on Render, you can still create a Render Static Site manually with the same frontend settings.

### 4) Seed demo data

After the backend is live, run the demo seed against the same MongoDB database:

- `cd backend`
- `npm run seed:demo`

### 5) Test logins

- Admin: `EMP1001 / Admin@123`
- Student 1: `STU1001 / Student@123`
- Student 2: `STU1002 / Student@123`

## Notes

- The frontend reads `REACT_APP_API_URL` at build time, so rebuild the static site after changing the backend URL.
- The backend already allows cross-origin requests, so the split deployment works without additional auth changes.
- If you want a single-server deployment later, the frontend can be built and served from Express, but the current split setup is the fastest path.