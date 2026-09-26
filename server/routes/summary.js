import express from 'express';
import { generateWithSources } from '../services/geminiService.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { sources, type = 'quick' } = req.body;
    if (!sources || Object.keys(sources).length === 0) {
      return res.status(400).json({ error: 'No sources provided.' });
    }

    const typePrompts = {
      quick: 'Generate a concise Quick Summary (300-400 words) covering the main ideas.',
      detailed: 'Generate a comprehensive Detailed Summary with all major concepts, definitions, examples, and explanations.',
      exam: `Generate an Exam-Focused Summary including:
- Key concepts and definitions
- Important formulas and theorems
- Common exam topics
- Critical points students must remember
- Potential exam question areas`,
    };

    const prompt = `${typePrompts[type] || typePrompts.quick}

Format the output with clear sections, headings, and bullet points for readability.
Base the summary ONLY on the provided source documents.`;

    const summary = await generateWithSources(sources, prompt, { temperature: 0.3 });
    res.json({ summary });
  } catch (err) {
    next(err);
  }
});

export default router;
