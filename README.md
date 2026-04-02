# CPS 630 A3, Spotify Clone Finale: Final Report

## 1. Overview

This project builds upon a basic MERN (MongoDB, Express, React, Node.js) Spotify clone, evolving it into a full-stack multi-user music library application. The final product brings real-time communication, user authentication, and a dark-mode UI together into a cohesive web application. It allows multiple users to register their own accounts and curate private music libraries without conflicting data, ensuring scalability and proper data isolation.

**Key capabilities include:**

- **Secure Authentication:** User-specific JWT tokens with bcrypt password hashing for secure sessions.
- **Multi-Tenant Architecture:** Full CRUD operations scoped per user (no data leakage between users).
- **Real-Time Communication:** Socket.io integration to broadcast activity events globally when songs are added or deleted.
- **Usability & Design:** A dark-themed UI adhering to Nielsen's usability heuristics to ensure accessibility and consistency.

---

## 2. Documentation (How to Run)

### Prerequisites

Before running the application, ensure the following software is installed on your machine:

- Node.js v18 or higher
- MongoDB running locally on port 27017

### Running the Project

You will need two terminal windows open, one for the backend API and one for the frontend React app.

**Terminal 1: Start the Backend:**
```bash
cd backend
npm install
npm run start
```

The backend API will start on `http://localhost:5000`.

**Terminal 2: Start the Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The React app will open on `http://localhost:5173` (or Vite's default port).

---

## 3. User Guide

1. **Register an account:** On first visit, click "Register" to create a username and password. Each account has its own isolated music library.
2. **Log in:** Use your credentials to log in. You will receive a JWT token that keeps you authenticated across the session.
3. **Browse your library:** Your home page shows all tracks added by you. It is empty at first; use the **Add Track** button to populate it.
4. **Manage Tracks:** Click "Add Track" and fill in song title, artist, album, and year. You can also edit or delete tracks via the track card options.
5. **Live Notifications:** If multiple tabs are open (or another user is logged in), toast notifications will pop up to show real-time changes made by others.

---

## 4. API Endpoints

> All song routes require an `Authorization: Bearer <token>` header.

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Create a new user account |
| POST | `/login` | Log in and receive a JWT token |

### Song Library (`/api/songs`)

> **Note:** All song routes are scoped to the logged-in user's private data.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Retrieve all songs belonging to the authenticated user |
| POST | `/` | Add a new song to the library |
| GET | `/:id` | Fetch a single song by its ID |
| PUT | `/:id` | Update an existing song's details |
| DELETE | `/:id` | Remove a song from the library |

---

## 5. Features & Architecture

### User Authentication & Data Isolation

We implemented JWT-based authentication and bcrypt password hashing. The backend was refactored from a shared, single-user data model to a proper multi-tenant setup, ensuring that every user's songs are completely isolated in their own MongoDB documents within the collection.

### Real-Time Communication (Socket.io)

The application utilizes an **Event-Driven Architecture**. Whenever any user adds or deletes a song, the server emits an event, and active clients listen to broadcast toast notifications globally. This creates a live "community" feel without requiring constant polling.

### Nielsen Usability Principles Applied

| Principle | Implementation |
|-----------|---------------|
| **Visibility of System Status** | Real-time Socket.io toast notifications inform users of global data changes; loading spinners provide feedback during API calls. |
| **Match between System and Real World** | Industry-standard terminology (e.g., "Library", "Track") and universal icons (plus, trash can) for an intuitive experience. |
| **Consistency and Standards** | A centralized CSS design system ensures a uniform look-and-feel across all views, adhering to common streaming platform standards. |
| **Error Prevention & Recovery** | Input fields in the "Add Track" and Auth forms are validated on the frontend and backend, with descriptive error messages to help users recover. |
| **Aesthetic and Minimalist Design** | Dark-mode UI focuses on high-contrast visuals and clean layouts, ensuring content (album covers) is the primary focus without visual clutter. |

---

## 6. Reflection

### Successes

The part we are most proud of is how cleanly the authentication and real-time features came together. Migrating from a shared data model to a proper multi-tenant setup required rethinking backend routes and frontend state, which felt like a significant technical milestone. The Socket.io integration was also a highlight, seeing one user's action silently notify everyone else without any input made the app feel genuinely alive.

### Challenges

The trickiest part was wiring up React Router with authentication context. Components were rendering before auth states resolved. We solved this by creating a custom `ProtectedRoute` wrapper component to handle redirects safely.

On the backend side, sharing the HTTP server instance between Express and Socket.io caused early confusion; we had to ensure both were initialized from the same instance to avoid route conflicts. Overall, the project was challenging but rewarding, seeing the auth, real-time events, and clean UI come together made the debugging process worth it.