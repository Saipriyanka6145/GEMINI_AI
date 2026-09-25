import streamlit as st

def render_header():
    st.markdown("""
        <style>
        .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 1rem;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 1.5rem;
        }
        .header-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #202124;
            margin: 0;
        }
        .header-subtitle {
            color: #5f6368;
            font-size: 0.9rem;
            margin: 0;
        }
        </style>
        <div class="header-container">
            <div>
                <h1 class="header-title">Gemini Campus Study Assistant</h1>
                <p class="header-subtitle">Turn your study material into an interactive AI-powered learning workspace.</p>
            </div>
        </div>
    """, unsafe_allow_html=True)
