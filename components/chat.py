import streamlit as st
from services.study_service import StudyService

def render_chat(sources):
    st.subheader("Ask anything about your sources")
    
    if "chat_history" not in st.session_state:
        st.session_state.chat_history = []
        
    col1, col2 = st.columns([0.8, 0.2])
    with col2:
        if st.button("Clear conversation", use_container_width=True):
            st.session_state.chat_history = []
            st.rerun()
            
    for msg in st.session_state.chat_history:
        st.chat_message(msg["role"]).write(msg["content"])
        
    user_input = st.chat_input("Ask a question about your uploaded material...")
    if user_input:
        st.session_state.chat_history.append({"role": "user", "content": user_input})
        st.chat_message("user").write(user_input)
        
        with st.spinner("Thinking..."):
            try:
                response = StudyService.ask_question(sources, user_input, st.session_state.chat_history)
                st.session_state.chat_history.append({"role": "assistant", "content": response})
                st.chat_message("assistant").write(response)
            except Exception as e:
                st.error(f"Error: {str(e)}")
