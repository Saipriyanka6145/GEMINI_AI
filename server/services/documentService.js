import pdfParse from 'pdf-parse/lib/pdf-parse.js';

export async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (err) {
    throw new Error(`PDF parsing failed: ${err.message}`);
  }
}

export function extractTextFromTxt(buffer) {
  return buffer.toString('utf-8');
}

export async function processDocument(file) {
  const ext = file.originalname.split('.').pop().toLowerCase();
  if (ext === 'pdf') {
    return extractTextFromPDF(file.buffer);
  } else if (ext === 'txt') {
    return extractTextFromTxt(file.buffer);
  }
  throw new Error(`Unsupported file type: .${ext}`);
}
