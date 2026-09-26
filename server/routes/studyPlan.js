import express from 'express';
import { generateWithSources } from '../services/geminiService.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { sources, examDate, hoursPerDay = 3, studyDays = 7, intensity = 'moderate' } = req.body;
    if (!sources || Object.keys(sources).length === 0) {
      return res.status(400).json({ error: 'No sources provided.' });
    }

    const examInfo = examDate ? `The exam is on ${examDate}.` : `Plan for ${studyDays} study days.`;

    const prompt = `Create a detailed ${studyDays}-day study plan based on the provided source material.

Parameters:
- ${examInfo}
- Available study time: ${hoursPerDay} hours per day
- Study intensity: ${intensity}

Generate a structured plan covering all major topics from the source material. Return as JSON:
{
  "overview": "Brief overview of the study plan",
  "days": [
    {
      "day": 1,
      "date": "Day 1",
      "focus": "Main topic for the day",
      "topics": ["Topic 1", "Topic 2"],
      "tasks": [
        { "time": "1 hour", "activity": "Read and highlight [specific section]" },
        { "time": "30 min", "activity": "Create summary notes" }
      ],
      "revision": "What to revise from previous days",
      "goal": "What you should be able to do after this session"
    }
  ],
  "tips": ["Study tip 1", "Study tip 2"]
}

Rules:
- Cover ALL major topics from the source material systematically
- Distribute topics logically across days (foundational first)
- Include time for revision and practice
- Match tasks to the ${intensity} intensity level
- Generate exactly ${studyDays} day entries`;

    const raw = await generateWithSources(sources, prompt, { asJson: true, temperature: 0.4 });
    const plan = JSON.parse(raw);
    res.json({ plan });
  } catch (err) {
    next(err);
  }
});

export default router;
