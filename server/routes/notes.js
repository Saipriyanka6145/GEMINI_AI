import express from 'express';
import { generateWithSources } from '../services/geminiService.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { sources } = req.body;
    if (!sources || Object.keys(sources).length === 0) {
      return res.status(400).json({ error: 'No sources provided.' });
    }

    const prompt = `Generate comprehensive, well-structured study notes from the provided source material.

For each major topic, structure the notes as:

## [Topic Name]
**Definition:** ...
**Key Explanation:** ...
**Key Points:**
- ...
**Examples:** ...
**Important Formulas/Concepts:** ... (if applicable)

Cover all significant topics from the source material. Make the notes revision-friendly and academically rigorous.`;

    const notes = await generateWithSources(sources, prompt, { temperature: 0.3 });
    res.json({ notes });
  } catch (err) {
    next(err);
  }
});

export default router;
