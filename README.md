# Gemini Campus Study Assistant

## Overview
Gemini Campus Study Assistant is a polished, professional AI research and study workspace inspired by the interaction model of Google NotebookLM. The entire application revolves around **your source material**. By uploading your textbooks, notes, or lectures, you create a personalized study environment powered by Google's Gemini API.

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
The application uses a modular architecture for clarity and maintainability.
- **Frontend:** Streamlit
- **AI / LLM:** Google Gemini API (`google-genai` Python SDK)
- **Document Processing:** PyPDF2

## Project Structure
```
gemini-campus-study-assistant/
├── app.py                  # Main Streamlit application
├── components/             # UI Components (Sidebar, Chat, Quiz, etc.)
├── services/               # Core logic (Gemini API, Document processing)
├── utils/                  # Prompts and Helpers
├── requirements.txt        # Python dependencies
├── .env.example            # Environment variables template
└── README.md
```

## Setup & Installation
1. Clone the repository: `git clone https://github.com/Saipriyanka6145/GEMINI_AI.git`
2. Change directory: `cd gemini-campus-study-assistant`
3. Install dependencies: `pip install -r requirements.txt`

## Environment Variables
Create a `.env` file in the root directory based on `.env.example`:
```
GEMINI_API_KEY=your_api_key_here
```

## Running Locally
```bash
streamlit run app.py
```

## Screenshots
*(Screenshots coming soon)*

## Future Improvements
- Audio/Video transcript processing
- Cloud document integration (Google Drive)
- Flashcard and Quiz export functionality

## Author
**POTHABATTULA ANNAPURNA DEVI SAI PRIYANKA**
GitHub: [Saipriyanka6145](https://github.com/Saipriyanka6145)
