import os
import json
from google import genai
from google.genai import types

class GeminiService:
    @staticmethod
    def get_client():
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set.")
        return genai.Client(api_key=api_key)

    @staticmethod
    def _build_context(sources):
        context = ""
        for name, text in sources.items():
            context += f"\n=== Source: {name} ===\n{text}\n"
        return context

    @staticmethod
    def generate_content(sources, prompt_text, as_json=False, system_instruction=None, history=None):
        client = GeminiService.get_client()
        config_params = {"temperature": 0.4}
        
        if as_json:
            config_params["response_mime_type"] = "application/json"
        
        if system_instruction:
            config_params["system_instruction"] = system_instruction
            
        full_prompt = ""
        if sources:
            context = GeminiService._build_context(sources)
            full_prompt += f"Selected Sources:\n{context}\n\n"
            
        if history:
            history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history])
            full_prompt += f"Conversation History:\n{history_text}\n\n"
            
        full_prompt += f"Task/Prompt:\n{prompt_text}"

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=full_prompt,
            config=types.GenerateContentConfig(**config_params)
        )
        return response.text
