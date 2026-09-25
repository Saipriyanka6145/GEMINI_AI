from services.gemini_service import GeminiService
from utils.prompts import (
    PROMPT_CHAT, PROMPT_SUMMARIZE, PROMPT_NOTES, 
    PROMPT_FLASHCARDS, PROMPT_QUIZ, PROMPT_STUDY_PLAN,
    PROMPT_EXPLAIN, PROMPT_PEER_LEARNING
)

class StudyService:
    @staticmethod
    def ask_question(sources, question, history):
        prompt = f"User Question: {question}"
        return GeminiService.generate_content(
            sources=sources, 
            prompt_text=prompt, 
            system_instruction=PROMPT_CHAT,
            history=history
        )

    @staticmethod
    def summarize(sources, length, format_type):
        prompt = PROMPT_SUMMARIZE.format(length=length, format_type=format_type)
        return GeminiService.generate_content(sources=sources, prompt_text=prompt)

    @staticmethod
    def generate_notes(sources):
        return GeminiService.generate_content(sources=sources, prompt_text=PROMPT_NOTES)

    @staticmethod
    def generate_flashcards(sources, num, diff):
        prompt = PROMPT_FLASHCARDS.format(num=num, difficulty=diff)
        return GeminiService.generate_content(sources=sources, prompt_text=prompt, as_json=True)

    @staticmethod
    def generate_quiz(sources, num, diff):
        prompt = PROMPT_QUIZ.format(num=num, difficulty=diff)
        return GeminiService.generate_content(sources=sources, prompt_text=prompt, as_json=True)

    @staticmethod
    def generate_study_plan(sources, exam_date, hours, days, diff):
        prompt = PROMPT_STUDY_PLAN.format(exam_date=exam_date, hours=hours, days=days, difficulty=diff)
        return GeminiService.generate_content(sources=sources, prompt_text=prompt)

    @staticmethod
    def explain_concept(sources, concept, level, analogy):
        prompt = PROMPT_EXPLAIN.format(concept=concept, level=level, analogy=analogy)
        return GeminiService.generate_content(sources=sources, prompt_text=prompt)

    @staticmethod
    def generate_peer_learning(sources):
        return GeminiService.generate_content(sources=sources, prompt_text=PROMPT_PEER_LEARNING)
