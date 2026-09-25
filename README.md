# Gemini Campus Study Assistant

## Overview
Gemini Campus Study Assistant is a web application designed for college students to help them study from their own learning materials using Google's Gemini API.

## Features
- **Upload Study Material**: PDF and TXT support.
- **Ask AI**: Chat with your documents to get answers based on the uploaded material.
- **Summarizer**: Generate quick or detailed summaries in bullet points or paragraphs.
- **Quiz Generator**: Create multiple-choice quizzes with explanations.
- **Flashcards**: Auto-generate flashcards for key concepts.
- **Study Plan Generator**: Get personalized study plans based on topic and time constraints.
- **Explain Concept**: Break down difficult concepts into simple terms.
- **Peer Learning Mode**: Transform complex topics into simple explanations meant for peer teaching.

## Tech Stack
- Python
- Streamlit
- Google Gemini API (google-genai)
- PyPDF2

## Architecture
Modular Streamlit application with dedicated utility components for Gemini API interactions, document processing, and prompt management.

## How It Works
1. User uploads a PDF or TXT file.
2. The application extracts and processes the text.
3. The text is kept in the session state.
4. User selects a feature from the sidebar.
5. The application communicates with the Gemini API to generate the requested content based on the extracted text.

## Installation
1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Setup environment variables.

## Environment Variables
Create a `.env` file in the root directory based on `.env.example`:
```
GEMINI_API_KEY=your_api_key_here
```

## Running Locally
```bash
streamlit run app.py
```

## Project Structure
```
gemini-campus-study-assistant/
├── app.py
├── requirements.txt
├── .env.example
├── .gitignore
├── README.md
└── utils/
    ├── __init__.py
    ├── gemini_client.py
    ├── document_processor.py
    ├── prompts.py
    └── helpers.py
```

## Screenshots
*(Coming soon)*

## Future Improvements
- Multi-document support
- Export features for quizzes and flashcards
- Cloud storage integration

## Author
POTHABATTULA ANNAPURNA DEVI SAI PRIYANKA
