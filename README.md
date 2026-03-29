# CPS 630 A3, Spotify Clone Finale

## Overview
This project builds upon the MERN Spotify clone, bringing real-time communication, user authentication, and a dark-mode UI together into a web application. The application allows multiple users to register their own accounts and curate their own private music libraries without conflicting with other users' data. It offers dark-themed interface, ensuring consistency inspired by Nielsen's design principles.

## Documentation (How to Run)

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally on default port `27017`

### 1. Start the Backend API
Open a terminal and navigate to the `backend` directory:
```bash
cd backend
npm install
npm run start
```

### 2. Start the Frontend App
Open a new terminal session and navigate to the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```

### 3. API Endpoints
The following REST API endpoints are available:

#### Authentication (`/api/auth`)
- `POST /register`: Register a new account.
- `POST /login`: Log in to an existing account and receive a JWT.

#### Song Library (`/api/songs`)
*Note: All song routes require an `Authorization: Bearer <token>` header.*
- `GET /`: Retrieve all songs belonging to the authenticated user.
- `POST /`: Add a new song to the user's library.
- `GET /:id`: Fetch a single song by its ID.
- `PUT /:id`: Update an existing song's details.
- `DELETE /:id`: Remove a song from the library.

## Features
- **User Authentication:** Sign up and Log in functionality powered by JWT and bcrypt. Each user manages their own music library.
- **Real-Time Communication:** Whenever any user adds or deletes a song from their library, a real-time event is broadcasted via Socket.io globally to inform active users of community activity!
- **Event-Driven Architecture:** The notification system is built on an event-driven model where the server 'emits' events and the client 'listens' and reacts, ensuring a decoupled and efficient flow of data.

## Nielsen Usability Principles Applied
We integrated the following principles:

1. **Visibility of System Status**: Real-time Socket.io toast notifications inform users of global data changes, while loading spinners provide feedback during API calls.
2. **Match between System and Real World**: We used industry-standard terminology (e.g., 'Library', 'Add Track', 'Track') and universal icons (e.g., plus, trash can, home) for an intuitive experience.
3. **Consistency and Standards**: A centralized CSS design system (`App.css`) ensures a uniform look-and-feel across all views, adhering to common streaming platform standards.
4. **Error Prevention & Recovery**: Input fields in the 'Add Track' and 'Auth' forms are validated on the frontend and backend, with descriptive error messages displayed to help users recover.
5. **Aesthetic and Minimalist Design**: Our dark-mode UI focuses on high-contrast visuals and clean layouts, ensuring the content (album covers) is the primary focus without visual clutter.

## Reflection
Our success included successfully migrating the shared model into an authenticated, multi-tenant environment (where every user owns their own data) and connecting the real-time activity socket stream into our React app. Some challenges involved refactoring React's Router hierarchy to support nested authentication context safely (accomplished using a custom `ProtectedRoute` wrapper) and correctly managing the HTTP server instance to be shared accurately between Express.js routes and Socket.io.

