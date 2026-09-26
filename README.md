# Gemini Campus Study Assistant

## Overview
Gemini Campus Study Assistant is a polished, professional AI research and study workspace inspired by the interaction model of Google NotebookLM. The entire application revolves around **your source material**. By uploading your textbooks, notes, or lectures, you create a personalized study environment powered by Google's Gemini API.

This project is built as a full-stack web application.

## Features
- **Source-Centered AI Workspace:** Every tool automatically utilizes your selected sources as context.
- **Ask AI:** Conversational interface that grounds answers strictly in your uploaded materials.
- **AI Notes & Summaries:** Generate structured notes and summaries directly from your documents.
- **Interactive Quizzes:** Build custom MCQs tailored to your specific uploaded content.
- **Flashcards:** Auto-generate flashcards focusing on key concepts from your sources.
- **Study Planner:** Generate a day-by-day study schedule based on your material and time constraints.
- **Concept Explainer:** Break down complex topics with examples and analogies.
- **Peer Learning Mode:** Transform difficult concepts into simple explanations designed for teaching classmates.
- **Multi-Source Support:** Select and work with multiple uploaded files simultaneously.

## Architecture & Tech Stack
The application uses a modern full-stack web architecture.
- **Frontend:** React, Vite, CSS (Professional Responsive UI)
- **Backend:** Node.js, Express.js
- **AI / LLM:** Google Gemini API (`@google/genai` SDK)
- **Document Processing:** pdf-parse, multer

## Project Structure
```
gemini-campus-study-assistant/
├── client/                 # Frontend React Application
│   ├── src/                
│   │   ├── components/     # UI Components (AskAI, Summary, Flashcards, etc.)
│   │   ├── pages/          # Page layouts (HomePage, WorkspacePage)
│   │   ├── services/       # API integration client
│   │   └── styles/         # CSS styles
│   └── package.json        
├── server/                 # Backend Node.js Application
│   ├── routes/             # API Endpoints (chat, notes, summary, upload, etc.)
│   ├── services/           # Core logic (Gemini API, Document processing)
│   ├── server.js           # Express Application
│   └── package.json        
├── .env.example            # Environment variables template
└── README.md
```

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm (or yarn/pnpm)

### 1. Clone the repository
```bash
git clone https://github.com/Saipriyanka6145/GEMINI_AI.git
cd gemini-campus-study-assistant
```

### 2. Environment Setup
Create a `.env` file in the root directory based on `.env.example`:
```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```
*Note: The Gemini API Key is only loaded by the backend server. It is never exposed to the frontend browser.*

### 3. Install Dependencies
In the root directory (or terminal tabs for client/server):

#### Backend:
```bash
cd server
npm install
```

#### Frontend:
```bash
cd client
npm install
```

## Running Locally

To run the application locally, start both the backend and frontend development servers.

### Backend:
```bash
cd server
npm run dev
```
Runs at `http://localhost:5000`

### Frontend:
```bash
cd client
npm run dev
```
Runs at `http://localhost:5173`

Access the frontend via `http://localhost:5173` in your browser.

## Deployment Preparation
- **Backend**: Can be deployed to Heroku, Render, or any Node.js environment. Make sure to set the `GEMINI_API_KEY` and `CLIENT_ORIGIN` (to your frontend URL).
- **Frontend**: Can be built using `npm run build` inside the `client` directory and deployed to Vercel, Netlify, or any static hosting service.

## Author
**POTHABATTULA ANNAPURNA DEVI SAI PRIYANKA**
GitHub: [Saipriyanka6145](https://github.com/Saipriyanka6145)
