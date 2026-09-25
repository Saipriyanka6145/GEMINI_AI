import streamlit as st
from services.study_service import StudyService

def render_explain(sources):
    st.subheader("Explain Concept")
    
    concept = st.text_input("Concept to explain (e.g., 'backpropagation')")
    
    col1, col2 = st.columns(2)
    with col1:
        level = st.selectbox("Level", ["Beginner", "Intermediate", "Advanced"])
    with col2:
        analogy = st.checkbox("Explain with an analogy", value=True)
        
    if st.button("Explain"):
        if not concept:
            st.warning("Please enter a concept.")
        else:
            with st.spinner(f"Explaining {concept}..."):
                try:
                    explanation = StudyService.explain_concept(sources, concept, level, "Yes" if analogy else "No")
                    st.write(explanation)
                except Exception as e:
                    st.error(f"Error: {str(e)}")

def render_peer_learning(sources):
    st.subheader("Peer Learning Mode")
    st.write("Help students turn difficult material into something they can explain to classmates.")
    
    if st.button("Generate Peer Content"):
        with st.spinner("Generating peer learning content..."):
            try:
                content = StudyService.generate_peer_learning(sources)
                st.session_state.peer_learning = content
            except Exception as e:
                st.error(f"Error: {str(e)}")
                
    if "peer_learning" in st.session_state:
        st.markdown("---")
        st.write(st.session_state.peer_learning)
