# Spotify Clone — (CPS630 - Assignment 2)

A full-stack Spotify clone built with the MERN stack (MongoDB, Express, React, Node.js).
This project allows managing a music library with Create, Read, Update, and Delete operations.

## Architecture

The application is split into two independent services:

- **Backend** (`/backend`): Node.js + Express REST API with MongoDB (Mongoose)  
- **Frontend** (`/frontend`): React + Vite application with React Router  

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB running locally on default port `27017`

## Quick Start

### 1. Start the Backend API

```bash
cd backend
npm install
npm run start
```
The backend runs on `http://localhost:3000`.  
> *Note: On the first run, if the database is empty, it will automatically test-seed 5 popular songs.*

### 2. Start the Frontend App

Open a new terminal session:

```bash
cd frontend
npm install
npm run dev
```
The frontend runs on `http://localhost:5173`.  
It automatically proxies `/api` requests to the backend server.

## Running Tests

### Backend Tests
The backend uses Jest, Supertest, and an in-memory MongoDB server for testing. To run the tests:
```bash
cd backend
npm test
```

### Frontend Tests
The frontend uses Vitest and React Testing Library for testing. To run the tests:
```bash
cd frontend
npm test
```

## Features

- **Home View**: Browse library with real-time text filtering
- **Add Track**: Form to create new songs with live cover art preview
- **Manage Library**: Admin table with inline editing and Delete
- **Premium UI**: Spotify-themed dark mode design, hover animations, toast notifications
