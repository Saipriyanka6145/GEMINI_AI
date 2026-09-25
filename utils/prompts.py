PROMPT_CHAT = """
You are an expert AI study assistant in a workspace similar to NotebookLM.
Your goal is to answer the user's questions based EXCLUSIVELY on the provided source materials.

IMPORTANT RULES:
1. Base your answer only on the provided context (Selected Sources).
2. If the sources contain the answer, provide a detailed and helpful response. Cite the source name when possible.
3. If the answer is NOT found in the provided sources, you MUST state: "I couldn't find this information in your selected sources. You can ask me to explain the topic using general knowledge." 
4. Do NOT hallucinate information that is not in the text.
"""

PROMPT_SUMMARIZE = """
Generate a beautiful, well-structured summary of the provided sources.
Length: {length}
Format: {format_type}

Sections to include:
- Overview
- Key Concepts
- Important Definitions
- Important Points
- Exam-Focused Revision

Do not invent information. Use only the provided sources.
"""

PROMPT_NOTES = """
Create structured AI Study Notes from the selected sources.

Format exactly like this using Markdown:
# [Topic Name]

## Core Concept
[Explanation]

## Important Terms
- **[Term]**: [Definition]

## Key Points
- [Point]
- [Point]

## Remember
[Short memory aid]

Ensure it covers the main ideas of the uploaded documents.
"""

PROMPT_FLASHCARDS = """
Generate {num} flashcards based ONLY on the provided sources.
Difficulty: {difficulty}
Focus on key terms, concepts, and definitions.

Output MUST be strictly a JSON list of objects:
[
  {
    "front": "Question or Term",
    "back": "Answer or Explanation"
  }
]
"""

PROMPT_QUIZ = """
Generate a multiple-choice quiz based ONLY on the provided sources.
Number of questions: {num}
Difficulty: {difficulty}

Output MUST be strictly a JSON list of objects:
[
  {
    "question": "The question text",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "correct_answer": "The exact string of the correct option",
    "explanation": "Short explanation"
  }
]
"""

PROMPT_STUDY_PLAN = """
Generate a structured study plan based on the topics in the provided sources.
Exam date (optional): {exam_date}
Hours per day: {hours}
Number of days: {days}
Difficulty: {difficulty}

Format as a day-by-day Markdown schedule:
### Day 1: [Topic]
- **What to study**: ...
- **Time**: ...
- **Practice**: ...
- **Revision**: ...
"""

PROMPT_EXPLAIN = """
Explain the concept based on the sources.
Concept: {concept}
Level: {level}
Explain with analogy: {analogy}

Provide a structured response:
- Simple Explanation
- Technical Explanation
- Example
- Analogy (if requested)
- Key Takeaway
"""

PROMPT_PEER_LEARNING = """
Help the student turn this material into something they can explain to classmates.

Output format:
- Simple Explanation: (Clear and engaging)
- Real-world Analogy: (To make it relatable)
- 3 Key Takeaways: (Core points to emphasize)
- 3 Discussion Questions: (To engage the classmates)
- Mini Teaching Script: (A 2-minute script to teach this topic)
"""
