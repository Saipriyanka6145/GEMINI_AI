import streamlit as st
import json
from services.study_service import StudyService

def render_quiz(sources):
    st.subheader("Interactive Quiz")
    
    col1, col2 = st.columns(2)
    with col1:
        num = st.selectbox("Number of questions", [5, 10, 15])
    with col2:
        diff = st.selectbox("Difficulty", ["Easy", "Medium", "Hard"])
        
    if st.button("Build your quiz"):
        with st.spinner("Building your quiz..."):
            try:
                quiz_json = StudyService.generate_quiz(sources, num, diff)
                st.session_state.quiz_data = json.loads(quiz_json)
                st.session_state.quiz_submitted = False
            except Exception as e:
                st.error(f"Error generating quiz: {str(e)}")
                
    if "quiz_data" in st.session_state and st.session_state.quiz_data:
        st.markdown("---")
        with st.form("quiz_form"):
            user_answers = {}
            for i, q in enumerate(st.session_state.quiz_data):
                st.write(f"**{i+1}. {q['question']}**")
                user_answers[i] = st.radio(
                    label=f"Options for Q{i+1}", 
                    options=q['options'], 
                    key=f"q_{i}",
                    label_visibility="collapsed"
                )
                st.write("")
                
            submitted = st.form_submit_button("Submit Quiz")
            if submitted:
                st.session_state.quiz_submitted = True
                
        if st.session_state.get("quiz_submitted"):
            score = 0
            for i, q in enumerate(st.session_state.quiz_data):
                if user_answers[i] == q['correct_answer']:
                    score += 1
                    st.success(f"**Q{i+1}: Correct!** {q['explanation']}")
                else:
                    st.error(f"**Q{i+1}: Incorrect.** The correct answer is **{q['correct_answer']}**. {q['explanation']}")
            
            total = len(st.session_state.quiz_data)
            st.write("---")
            st.write(f"### Score: {score} / {total}")
            st.write(f"### Percentage: {(score/total)*100:.1f}%")
