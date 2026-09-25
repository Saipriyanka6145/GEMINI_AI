import streamlit as st
from pathlib import Path
from dotenv import load_dotenv
import os

# ─── Load .env from project root (works regardless of launch directory) ───────
PROJECT_ROOT = Path(__file__).resolve().parent
ENV_FILE = PROJECT_ROOT / ".env"
load_dotenv(dotenv_path=ENV_FILE, override=True)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Safe debug info (key is never printed)
print(f"[startup] ENV FILE EXISTS : {ENV_FILE.exists()}")
print(f"[startup] GEMINI KEY LOADED: {bool(GEMINI_API_KEY)}")

# ─── Components ───────────────────────────────────────────────────────────────
from components.header import render_header
from components.source_panel import render_source_panel
from components.chat import render_chat
from components.summary import render_summary, render_notes
from components.flashcards import render_flashcards
from components.quiz import render_quiz
from components.study_plan import render_study_plan
from components.explain import render_explain, render_peer_learning
from utils.helpers import get_selected_sources

# ─── Page config ─────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Gemini Campus Study Assistant",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown("""
<style>
    .stApp { background-color: #f8f9fa; }
    .main .block-container { padding-top: 2rem; padding-bottom: 2rem; }
    .stButton>button { border-radius: 8px; }
</style>
""", unsafe_allow_html=True)

# ─── Session state ────────────────────────────────────────────────────────────
if "sources" not in st.session_state:
    st.session_state.sources = {}
if "selected_sources" not in st.session_state:
    st.session_state.selected_sources = []


def main():
    # ── API key guard ─────────────────────────────────────────────────────────
    if not GEMINI_API_KEY:
        st.error(
            "**Gemini API key is not configured.**\n\n"
            f"Create the file `{ENV_FILE}` with the following content:\n\n"
            "```\nGEMINI_API_KEY=your_actual_api_key_here\n```\n\n"
            "Then restart the application with `streamlit run app.py`."
        )
        st.stop()

    render_header()

    # ── Empty state: no sources uploaded yet ──────────────────────────────────
    if not st.session_state.sources:
        st.markdown("### Start with your study material")
        st.write("Upload notes, lectures, or textbooks to begin your AI workspace.")

        uploaded_files = st.file_uploader(
            "Upload your notes, lectures, textbooks or study material",
            type=["pdf", "txt"],
            accept_multiple_files=True,
        )
        if uploaded_files:
            from services.document_service import DocumentService
            for file in uploaded_files:
                if file.name not in st.session_state.sources:
                    with st.spinner(f"Processing {file.name}…"):
                        text = DocumentService.process_document(file)
                        if text and not text.startswith("Error"):
                            st.session_state.sources[file.name] = {
                                "text": text,
                                "size": len(file.getvalue()),
                                "type": file.name.split(".")[-1],
                            }
                        else:
                            st.error(f"Could not process {file.name}")
            st.session_state.selected_sources = list(st.session_state.sources.keys())
            st.rerun()

    else:
        # ── Main workspace ────────────────────────────────────────────────────
        render_source_panel()

        if not st.session_state.selected_sources:
            st.info("Please select at least one source from the sidebar to continue.")
            return

        st.write("Your sources stay at the center of every study tool.")

        tabs = st.tabs([
            "ASK AI", "NOTES", "SUMMARY", "FLASHCARDS",
            "QUIZ", "STUDY PLAN", "EXPLAIN", "PEER LEARNING",
        ])
        sources_dict = get_selected_sources()

        with tabs[0]:
            render_chat(sources_dict)
        with tabs[1]:
            render_notes(sources_dict)
        with tabs[2]:
            render_summary(sources_dict)
        with tabs[3]:
            render_flashcards(sources_dict)
        with tabs[4]:
            render_quiz(sources_dict)
        with tabs[5]:
            render_study_plan(sources_dict)
        with tabs[6]:
            render_explain(sources_dict)
        with tabs[7]:
            render_peer_learning(sources_dict)


if __name__ == "__main__":
    main()
