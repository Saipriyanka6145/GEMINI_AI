import os
from google import genai
from google.genai import types
import json

def get_client():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set.")
    return genai.Client(api_key=api_key)

def ask_question(context, question, history=None):
    client = get_client()
    system_instruction = "You are an AI study assistant. Answer the user's question primarily based on the provided context document. If the answer is not present in the uploaded material, clearly state that. Avoid pretending information exists in the document when it does not."
    
    prompt = f"Context Document:\n{context}\n\nUser Question: {question}"
    
    # Ideally we'd use client.chats, but for simplicity with history we can pass it manually or just use generate_content
    # Here we simulate chat history by prepending it to the prompt.
    full_prompt = prompt
    if history:
        history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history])
        full_prompt = f"Conversation History:\n{history_text}\n\n{prompt}"
        
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=full_prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.3
        )
    )
    return response.text

def generate_content(prompt_text, as_json=False):
    client = get_client()
    config_params = {"temperature": 0.5}
    if as_json:
        config_params["response_mime_type"] = "application/json"
        
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt_text,
        config=types.GenerateContentConfig(**config_params)
    )
    return response.text
