PROMPT_SUMMARIZE = """
You are an expert academic tutor. Summarize the following study material.
Mode: {mode} (1=Quick Summary, 2=Detailed Summary)
Format: {format_type} (Bullet points or Paragraph format)

Ensure the summary includes:
- Key concepts
- Important definitions
- Important points
- Possible exam-relevant areas

Do not invent information that isn't supported by the uploaded material.

Study Material:
{document_text}
"""

PROMPT_QUIZ = """
You are an expert academic tutor. Generate a multiple-choice quiz based ONLY on the provided study material.
Number of questions: {num_questions}
Difficulty: {difficulty}

Format the output strictly as a JSON list of objects with the following keys:
- "question": The question text
- "options": A list of exactly 4 choices (e.g., ["A) ...", "B) ...", "C) ...", "D) ..."])
- "correct_answer": The exact string of the correct option from the options list
- "explanation": A short explanation of why it is correct based on the text.

Study Material:
{document_text}
"""

PROMPT_FLASHCARDS = """
You are an expert academic tutor. Generate {num_flashcards} flashcards based ONLY on the provided study material.
Focus on key terms, concepts, and definitions.

Format the output strictly as a JSON list of objects with the following keys:
- "front": The concept or question
- "back": The definition or answer

Study Material:
{document_text}
"""

PROMPT_STUDY_PLAN = """
You are an expert academic planner. Generate a structured, personalized study plan.
Subject/topic: {topic}
Number of days: {days}
Hours available per day: {hours}
Exam date (optional): {exam_date}
Difficulty level: {difficulty}

Generate a clear daily plan including:
- Day number
- Topic to cover
- Study duration
- Tasks
- Revision
- Practice

Provide the plan in markdown format.
"""

PROMPT_EXPLAIN_CONCEPT = """
You are an expert academic tutor. Explain the following concept clearly.
Concept: {concept}
Explanation Level: {level} (Beginner, Intermediate, Advanced)
Include Example: {include_example}

Provide a structured response:
- Simple explanation
- Key idea
- Example (if requested)
- Important terms
- Common mistake to avoid
"""

PROMPT_PEER_LEARNING = """
You are helping a student prepare to teach a concept to their classmates. 
Transform the given topic into a simple, engaging explanation suitable for peer learning.

Topic: {topic}
Audience level: {audience}
Explanation length: {length}

Output format:
- Simple explanation: (Easy to understand and explain)
- Real-world analogy: (To make it relatable)
- 3 key takeaways: (Core points to remember)
- 3 discussion questions: (To engage the classmates)
"""
