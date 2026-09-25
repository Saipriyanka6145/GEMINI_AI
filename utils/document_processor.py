import PyPDF2
import io

def extract_text_from_pdf(file_bytes):
    """Extracts text from a PDF file."""
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        return text
    except Exception as e:
        return f"Error extracting PDF: {str(e)}"

def extract_text_from_txt(file_bytes):
    """Extracts text from a TXT file."""
    try:
        return file_bytes.decode('utf-8')
    except Exception as e:
        return f"Error extracting text: {str(e)}"

def process_document(uploaded_file):
    """Processes uploaded file based on its type."""
    if uploaded_file.name.endswith('.pdf'):
        return extract_text_from_pdf(uploaded_file.read())
    elif uploaded_file.name.endswith('.txt'):
        return extract_text_from_txt(uploaded_file.read())
    else:
        return None
