import express from 'express';
import { generateWithSources } from '../services/geminiService.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { sources, count = 10, difficulty = 'medium' } = req.body;
    if (!sources || Object.keys(sources).length === 0) {
      return res.status(400).json({ error: 'No sources provided.' });
    }

    const prompt = `Generate exactly ${count} multiple choice questions based on the provided study material.
Difficulty: ${difficulty}

Return a valid JSON array with this exact structure:
[
  {
    "id": 1,
    "question": "The question text",
    "options": ["A. Option A", "B. Option B", "C. Option C", "D. Option D"],
    "correctIndex": 0,
    "explanation": "Why this answer is correct, referencing the source material",
    "topic": "Topic name"
  }
]

Rules:
- Base ALL questions strictly on the source material
- correctIndex is 0-based (0=A, 1=B, 2=C, 3=D)
- All 4 options must be plausible
- Include clear, educational explanations
- For ${difficulty} difficulty: ${
  difficulty === 'easy' ? 'test recall of basic facts and definitions' :
  difficulty === 'hard' ? 'test analysis, comparison, and application of complex concepts' :
  'mix recall, understanding, and application'
}`;

    const raw = await generateWithSources(sources, prompt, { asJson: true, temperature: 0.5 });
    const questions = JSON.parse(raw);
    res.json({ questions });
  } catch (err) {
    next(err);
  }
});

export default router;
