import express from 'express';
import { generateWithSources } from '../services/geminiService.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { sources, topic } = req.body;
    if (!sources || Object.keys(sources).length === 0) {
      return res.status(400).json({ error: 'No sources provided.' });
    }

    const topicLine = topic ? `Focus specifically on: "${topic}"` : 'Cover the most important concepts from the material.';

    const prompt = `You are helping a student prepare to explain their study material to classmates (peer teaching).
${topicLine}

Generate a peer teaching guide in this JSON format:
{
  "topic": "The topic being taught",
  "simpleExplanation": "A clear, friendly explanation as if talking to a classmate",
  "analogy": "A memorable analogy that makes the concept click",
  "keyTakeaways": [
    "Takeaway 1 - the most important thing to remember",
    "Takeaway 2",
    "Takeaway 3"
  ],
  "discussionQuestions": [
    "Question to spark discussion 1",
    "Question 2",
    "Question 3"
  ],
  "teachingScript": "A 2-3 paragraph mini teaching script the student can adapt",
  "commonConfusions": ["Common confusion 1 and how to address it"],
  "quickQuiz": [
    { "question": "Quick check question", "answer": "Expected answer" }
  ]
}

Make this practical, conversational, and genuinely useful for a student preparing to teach their peers.`;

    const raw = await generateWithSources(sources, prompt, { asJson: true, temperature: 0.5 });
    const guide = JSON.parse(raw);
    res.json({ guide });
  } catch (err) {
    next(err);
  }
});

export default router;
