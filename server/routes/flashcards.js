import express from 'express';
import { generateWithSources } from '../services/geminiService.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { sources, count = 10, difficulty = 'medium' } = req.body;
    if (!sources || Object.keys(sources).length === 0) {
      return res.status(400).json({ error: 'No sources provided.' });
    }

    const prompt = `Generate exactly ${count} flashcards based on the provided study material.
Difficulty level: ${difficulty}

Return a valid JSON array with this exact structure:
[
  {
    "id": 1,
    "front": "Question or concept on the front of the card",
    "back": "Detailed answer or explanation on the back",
    "topic": "The topic this card belongs to"
  }
]

Rules:
- Base ALL flashcards strictly on the provided source material
- For ${difficulty} difficulty: ${
  difficulty === 'easy' ? 'focus on basic definitions and key terms' :
  difficulty === 'hard' ? 'focus on complex concepts, analysis, and application' :
  'mix definitions, explanations, and application questions'
}
- Make front questions clear and specific
- Make back answers comprehensive but concise
- Cover diverse topics from the material`;

    const raw = await generateWithSources(sources, prompt, { asJson: true, temperature: 0.5 });
    const flashcards = JSON.parse(raw);
    res.json({ flashcards });
  } catch (err) {
    next(err);
  }
});

export default router;
