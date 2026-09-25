import streamlit as st
import json
from services.study_service import StudyService

def render_flashcards(sources):
    st.subheader("Flashcards")
    
    col1, col2 = st.columns(2)
    with col1:
        num = st.selectbox("Number of cards", [10, 20, 30])
    with col2:
        diff = st.selectbox("Difficulty", ["Easy", "Medium", "Hard"])
        
    if st.button("Generate Flashcards"):
        with st.spinner("Creating flashcards..."):
            try:
                fc_json = StudyService.generate_flashcards(sources, num, diff)
                st.session_state.flashcards_data = json.loads(fc_json)
                st.session_state.current_fc = 0
            except Exception as e:
                st.error(f"Error generating flashcards: {str(e)}")
                
    if "flashcards_data" in st.session_state and st.session_state.flashcards_data:
        st.markdown("---")
        fc_list = st.session_state.flashcards_data
        curr = st.session_state.current_fc
        total = len(fc_list)
        
        st.write(f"**Card {curr + 1} / {total}**")
        
        card = fc_list[curr]
        
        st.info(f"**Front:**\n{card['front']}")
        
        if st.button("Flip"):
            st.success(f"**Back:**\n{card['back']}")
            
        col1, col2, col3 = st.columns(3)
        with col1:
            if st.button("Previous", use_container_width=True):
                if curr > 0:
                    st.session_state.current_fc -= 1
                    st.rerun()
        with col2:
            if st.button("Next", use_container_width=True):
                if curr < total - 1:
                    st.session_state.current_fc += 1
                    st.rerun()
        with col3:
            if st.button("Reset", use_container_width=True):
                st.session_state.current_fc = 0
                st.rerun()
