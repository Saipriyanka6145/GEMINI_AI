import streamlit as st
from services.study_service import StudyService

def render_summary(sources):
    st.subheader("Generate Summary")
    
    col1, col2 = st.columns(2)
    with col1:
        length = st.selectbox("Summary length", ["Short", "Detailed"])
    with col2:
        format_type = st.selectbox("Format", ["Bullet points", "Structured notes"])
        
    if st.button("Generate / Regenerate"):
        with st.spinner("Generating summary..."):
            try:
                summary = StudyService.summarize(sources, length, format_type)
                st.session_state.current_summary = summary
            except Exception as e:
                st.error(f"Error: {str(e)}")
                
    if "current_summary" in st.session_state:
        st.markdown("---")
        st.write(st.session_state.current_summary)

def render_notes(sources):
    st.subheader("AI Study Notes")
    
    if st.button("Generate Notes"):
        with st.spinner("Generating your study notes..."):
            try:
                notes = StudyService.generate_notes(sources)
                st.session_state.current_notes = notes
            except Exception as e:
                st.error(f"Error: {str(e)}")
                
    if "current_notes" in st.session_state:
        st.markdown("---")
        st.write(st.session_state.current_notes)
