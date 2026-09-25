import streamlit as st
from services.document_service import DocumentService

def render_source_panel():
    st.sidebar.title("SOURCES")
    
    # Upload new source
    uploaded_files = st.sidebar.file_uploader(
        "Add Source", type=["pdf", "txt"], accept_multiple_files=True, 
        label_visibility="collapsed"
    )
    
    if uploaded_files:
        if "sources" not in st.session_state:
            st.session_state.sources = {}
            
        for file in uploaded_files:
            if file.name not in st.session_state.sources:
                with st.spinner(f"Processing {file.name}..."):
                    text = DocumentService.process_document(file)
                    if text and not text.startswith("Error"):
                        st.session_state.sources[file.name] = {
                            "text": text,
                            "size": len(file.getvalue()),
                            "type": file.name.split('.')[-1]
                        }
                    else:
                        st.sidebar.error(f"⚠ Could not process {file.name}")
        
    # List existing sources
    if "sources" in st.session_state and st.session_state.sources:
        if "selected_sources" not in st.session_state:
            st.session_state.selected_sources = list(st.session_state.sources.keys())
            
        st.sidebar.markdown("---")
        
        # Select all / Clear all
        col1, col2 = st.sidebar.columns(2)
        if col1.button("Select All"):
            st.session_state.selected_sources = list(st.session_state.sources.keys())
            st.rerun()
        if col2.button("Clear All"):
            st.session_state.sources = {}
            st.session_state.selected_sources = []
            st.session_state.chat_history = []
            st.rerun()
            
        st.sidebar.markdown(f"**Selected Sources: {len(st.session_state.selected_sources)}**")
        
        new_selected = []
        for name, data in st.session_state.sources.items():
            kb_size = data['size'] / 1024
            label = f"📄 {name} ({kb_size:.1f} KB)"
            is_selected = name in st.session_state.selected_sources
            
            # Use checkbox for selection
            if st.sidebar.checkbox(label, value=is_selected, key=f"src_{name}"):
                new_selected.append(name)
                
        st.session_state.selected_sources = new_selected
    else:
        st.sidebar.info("No sources added yet.")
