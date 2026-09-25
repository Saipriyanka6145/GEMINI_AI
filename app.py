import streamlit as st
import os
import json
from dotenv import load_dotenv

from utils.document_processor import process_document
from utils.gemini_client import ask_question, generate_content
from utils.prompts import (
    PROMPT_SUMMARIZE, PROMPT_QUIZ, PROMPT_FLASHCARDS,
    PROMPT_STUDY_PLAN, PROMPT_EXPLAIN_CONCEPT, PROMPT_PEER_LEARNING
)

# Load environment variables
load_dotenv()

st.set_page_config(page_title="Gemini Campus Study Assistant", layout="wide")

# Initialize session state variables
if "document_text" not in st.session_state:
    st.session_state.document_text = None
if "document_name" not in st.session_state:
    st.session_state.document_name = None
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []
if "flashcards" not in st.session_state:
    st.session_state.flashcards = []
if "current_flashcard" not in st.session_state:
    st.session_state.current_flashcard = 0
if "quiz_data" not in st.session_state:
    st.session_state.quiz_data = []

# Sidebar Navigation
st.sidebar.title("📚 Campus Study Assistant")
st.sidebar.markdown("*Powered by Google Gemini*")

nav_options = [
    "Home", "Study Material", "Ask AI", "Summarize", 
    "Quiz", "Flashcards", "Study Plan", "Explain Concept", "Peer Learning"
]
selection = st.sidebar.radio("Navigation", nav_options)

def require_document():
    if not st.session_state.document_text:
        st.warning("Please upload study material in the 'Study Material' section first.")
        return False
    return True

# ----------------- HOME -----------------
if selection == "Home":
    st.title("Gemini Campus Study Assistant 🎓")
    st.markdown("### Turn your study material into an interactive AI-powered learning experience.")
    
    st.write("Welcome! This application uses Google's Gemini AI to help you study more effectively.")
    st.write("**Features:**")
    st.markdown("""
    - 📄 **Study Material:** Upload PDFs or Text files.
    - 💬 **Ask AI:** Chat with your document.
    - 📝 **Summarize:** Get quick or detailed summaries.
    - 🧠 **Quiz:** Generate custom MCQs to test your knowledge.
    - 🗂️ **Flashcards:** Auto-generate flashcards for key terms.
    - 📅 **Study Plan:** Plan your study schedule.
    - 💡 **Explain Concept:** Simplify hard concepts.
    - 👥 **Peer Learning:** Prepare to teach classmates.
    """)
    
    if not os.environ.get("GEMINI_API_KEY"):
        st.error("⚠️ GEMINI_API_KEY is not set. Please create a .env file and add your API key.")

# ----------------- STUDY MATERIAL -----------------
elif selection == "Study Material":
    st.title("Upload Study Material")
    
    uploaded_file = st.file_uploader("Upload a PDF or TXT file", type=["pdf", "txt"])
    
    if uploaded_file is not None:
        with st.spinner("Processing document..."):
            extracted_text = process_document(uploaded_file)
            
            if extracted_text and not extracted_text.startswith("Error"):
                st.session_state.document_text = extracted_text
                st.session_state.document_name = uploaded_file.name
                st.success(f"Successfully processed {uploaded_file.name}")
                st.info(f"Extracted {len(extracted_text)} characters.")
            else:
                st.error("Failed to extract text. Please try another file.")
                if extracted_text:
                    st.error(extracted_text)
                    
    if st.session_state.document_text:
        st.write(f"**Current Document:** {st.session_state.document_name}")
        if st.button("Clear Document"):
            st.session_state.document_text = None
            st.session_state.document_name = None
            st.session_state.chat_history = []
            st.rerun()

# ----------------- ASK AI -----------------
elif selection == "Ask AI":
    st.title("Ask AI")
    if require_document():
        if st.button("Clear Conversation"):
            st.session_state.chat_history = []
            st.rerun()
            
        for msg in st.session_state.chat_history:
            st.chat_message(msg["role"]).write(msg["content"])

        user_input = st.chat_input("Ask a question about your document...")
        if user_input:
            st.session_state.chat_history.append({"role": "user", "content": user_input})
            st.chat_message("user").write(user_input)
            
            with st.spinner("Thinking..."):
                try:
                    response = ask_question(st.session_state.document_text, user_input, st.session_state.chat_history)
                    st.session_state.chat_history.append({"role": "assistant", "content": response})
                    st.chat_message("assistant").write(response)
                except Exception as e:
                    st.error(f"Error communicating with Gemini: {str(e)}")

# ----------------- SUMMARIZE -----------------
elif selection == "Summarize":
    st.title("Summarizer")
    if require_document():
        mode = st.radio("Mode", ["Quick Summary", "Detailed Summary"])
        format_type = st.radio("Format", ["Bullet points", "Paragraph format"])
        
        if st.button("Generate Summary"):
            with st.spinner("Summarizing..."):
                try:
                    prompt = PROMPT_SUMMARIZE.format(
                        mode=mode, 
                        format_type=format_type, 
                        document_text=st.session_state.document_text
                    )
                    summary = generate_content(prompt)
                    st.write(summary)
                except Exception as e:
                    st.error(f"Error: {str(e)}")

# ----------------- QUIZ -----------------
elif selection == "Quiz":
    st.title("Quiz Generator")
    if require_document():
        num_q = st.selectbox("Number of questions", [5, 10, 15])
        diff = st.selectbox("Difficulty", ["Easy", "Medium", "Hard"])
        
        if st.button("Generate Quiz"):
            with st.spinner("Generating Quiz..."):
                try:
                    prompt = PROMPT_QUIZ.format(
                        num_questions=num_q, 
                        difficulty=diff, 
                        document_text=st.session_state.document_text
                    )
                    quiz_json_str = generate_content(prompt, as_json=True)
                    st.session_state.quiz_data = json.loads(quiz_json_str)
                    st.success("Quiz generated!")
                except Exception as e:
                    st.error(f"Error generating quiz: {str(e)}")
                    
        if st.session_state.quiz_data:
            st.write("---")
            with st.form("quiz_form"):
                user_answers = {}
                for i, q in enumerate(st.session_state.quiz_data):
                    st.write(f"**Q{i+1}: {q['question']}**")
                    user_answers[i] = st.radio(f"Options for Q{i+1}", q['options'], key=f"q_{i}")
                    
                submitted = st.form_submit_button("Submit Quiz")
                if submitted:
                    score = 0
                    for i, q in enumerate(st.session_state.quiz_data):
                        if user_answers[i] == q['correct_answer']:
                            score += 1
                            st.success(f"Q{i+1}: Correct! {q['explanation']}")
                        else:
                            st.error(f"Q{i+1}: Incorrect. Correct answer is {q['correct_answer']}. {q['explanation']}")
                    
                    st.write(f"### Final Score: {score} / {len(st.session_state.quiz_data)}")
                    st.write(f"### Percentage: {(score/len(st.session_state.quiz_data))*100:.2f}%")

# ----------------- FLASHCARDS -----------------
elif selection == "Flashcards":
    st.title("Flashcard Generator")
    if require_document():
        if st.button("Generate Flashcards"):
            with st.spinner("Generating flashcards..."):
                try:
                    prompt = PROMPT_FLASHCARDS.format(
                        num_flashcards=10, 
                        document_text=st.session_state.document_text
                    )
                    fc_json_str = generate_content(prompt, as_json=True)
                    st.session_state.flashcards = json.loads(fc_json_str)
                    st.session_state.current_flashcard = 0
                except Exception as e:
                    st.error(f"Error: {str(e)}")
                    
        if st.session_state.flashcards:
            total = len(st.session_state.flashcards)
            curr = st.session_state.current_flashcard
            
            st.write(f"Card {curr + 1} of {total}")
            card = st.session_state.flashcards[curr]
            
            st.info(f"**Concept:** {card['front']}")
            
            if st.button("Show Answer"):
                st.success(f"**Answer:** {card['back']}")
                
            col1, col2, col3 = st.columns(3)
            if col1.button("Previous"):
                if curr > 0:
                    st.session_state.current_flashcard -= 1
                    st.rerun()
            if col2.button("Next"):
                if curr < total - 1:
                    st.session_state.current_flashcard += 1
                    st.rerun()
            if col3.button("Reset"):
                st.session_state.current_flashcard = 0
                st.rerun()

# ----------------- STUDY PLAN -----------------
elif selection == "Study Plan":
    st.title("Study Plan Generator")
    topic = st.text_input("Subject / Topic")
    days = st.number_input("Number of days", min_value=1, max_value=90, value=7)
    hours = st.number_input("Hours available per day", min_value=1, max_value=16, value=2)
    exam_date = st.text_input("Exam date (optional)")
    diff = st.selectbox("Difficulty level", ["Beginner", "Intermediate", "Advanced"])
    
    if st.button("Generate Plan"):
        if not topic:
            st.error("Please enter a topic.")
        else:
            with st.spinner("Generating plan..."):
                try:
                    prompt = PROMPT_STUDY_PLAN.format(
                        topic=topic, days=days, hours=hours, exam_date=exam_date, difficulty=diff
                    )
                    plan = generate_content(prompt)
                    st.write(plan)
                except Exception as e:
                    st.error(f"Error: {str(e)}")

# ----------------- EXPLAIN CONCEPT -----------------
elif selection == "Explain Concept":
    st.title("Explain Concept")
    concept = st.text_input("Concept to explain")
    level = st.selectbox("Level", ["Beginner", "Intermediate", "Advanced"])
    include_example = st.checkbox("Explain with an example", value=True)
    
    if st.button("Explain"):
        if not concept:
            st.error("Please enter a concept.")
        else:
            with st.spinner("Explaining..."):
                try:
                    prompt = PROMPT_EXPLAIN_CONCEPT.format(
                        concept=concept, level=level, include_example="Yes" if include_example else "No"
                    )
                    explanation = generate_content(prompt)
                    st.write(explanation)
                except Exception as e:
                    st.error(f"Error: {str(e)}")

# ----------------- PEER LEARNING -----------------
elif selection == "Peer Learning":
    st.title("Peer Learning Mode")
    st.write("Transform a difficult topic into a simple explanation you can share with classmates.")
    
    topic = st.text_input("Topic")
    audience = st.selectbox("Audience level", ["High School", "College Freshmen", "Advanced Classmates"])
    length = st.selectbox("Explanation length", ["Short (2 mins)", "Medium (5 mins)", "Detailed (10 mins)"])
    
    if st.button("Generate Peer Content"):
        if not topic:
            st.error("Please enter a topic.")
        else:
            with st.spinner("Generating content..."):
                try:
                    prompt = PROMPT_PEER_LEARNING.format(
                        topic=topic, audience=audience, length=length
                    )
                    content = generate_content(prompt)
                    st.write(content)
                except Exception as e:
                    st.error(f"Error: {str(e)}")
