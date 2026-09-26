import express from 'express';
import { generateWithSources } from '../services/geminiService.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { sources, concept, level = 'intermediate' } = req.body;
    if (!concept?.trim()) return res.status(400).json({ error: 'Concept is required.' });
    if (!sources || Object.keys(sources).length === 0) {
      return res.status(400).json({ error: 'No sources provided.' });
    }

    const levelGuide = {
      beginner: 'Use simple language, avoid jargon, use everyday analogies. Assume no prior knowledge.',
      intermediate: 'Use standard academic language. Assume basic familiarity with the subject.',
      advanced: 'Use technical terminology. Explore nuances, edge cases, and deeper implications.',
    };

    const prompt = `Explain the concept: "${concept}"

Level: ${level} — ${levelGuide[level] || levelGuide.intermediate}

Provide your response in this JSON structure:
{
  "concept": "${concept}",
  "level": "${level}",
  "mainExplanation": "The core explanation of the concept",
  "analogy": "A relatable real-world analogy to help understand this concept",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "examples": ["Example 1", "Example 2"],
  "commonMisconceptions": ["Misconception 1 and correction"],
  "relatedConcepts": ["Related concept 1", "Related concept 2"]
}

Base your explanation on the provided source material. If the concept is not covered in the sources, note that and provide a general explanation.`;

    const raw = await generateWithSources(sources, prompt, { asJson: true, temperature: 0.4 });
    const explanation = JSON.parse(raw);
    res.json({ explanation });
  } catch (err) {
    next(err);
  }
});

export default router;
