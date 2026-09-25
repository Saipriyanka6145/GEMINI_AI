import streamlit as st

def get_selected_sources():
    sources = {}
    if "sources" in st.session_state and "selected_sources" in st.session_state:
        for name in st.session_state.selected_sources:
            if name in st.session_state.sources:
                sources[name] = st.session_state.sources[name]["text"]
    return sources
