import PyPDF2
import io

class DocumentService:
    @staticmethod
    def extract_text_from_pdf(file_bytes):
        try:
            reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
            text = ""
            for i, page in enumerate(reader.pages):
                extracted = page.extract_text()
                if extracted:
                    text += f"--- Page {i+1} ---\n{extracted}\n"
            return text
        except Exception as e:
            return f"Error extracting PDF: {str(e)}"

    @staticmethod
    def extract_text_from_txt(file_bytes):
        try:
            return file_bytes.decode('utf-8')
        except Exception as e:
            return f"Error extracting text: {str(e)}"

    @staticmethod
    def process_document(uploaded_file):
        if uploaded_file.name.endswith('.pdf'):
            return DocumentService.extract_text_from_pdf(uploaded_file.read())
        elif uploaded_file.name.endswith('.txt'):
            return DocumentService.extract_text_from_txt(uploaded_file.read())
        else:
            return None
