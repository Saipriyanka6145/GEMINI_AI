import streamlit as st
from services.study_service import StudyService

def render_study_plan(sources):
    st.subheader("Study Planner")
    
    col1, col2 = st.columns(2)
    with col1:
        days = st.number_input("Number of days", 1, 90, 7)
        hours = st.number_input("Hours per day", 1, 16, 2)
    with col2:
        exam_date = st.text_input("Exam date (optional)")
        diff = st.selectbox("Difficulty", ["Beginner", "Intermediate", "Advanced"])
        
    if st.button("Generate Study Plan"):
        with st.spinner("Building your study plan..."):
            try:
                plan = StudyService.generate_study_plan(sources, exam_date, hours, days, diff)
                st.session_state.study_plan = plan
            except Exception as e:
                st.error(f"Error: {str(e)}")
                
    if "study_plan" in st.session_state:
        st.markdown("---")
        st.write(st.session_state.study_plan)
