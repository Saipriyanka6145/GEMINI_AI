import express from 'express';
import { generateWithSources } from '../services/geminiService.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { sources, question, history = [] } = req.body;
    if (!question?.trim()) return res.status(400).json({ error: 'Question is required.' });
    if (!sources || Object.keys(sources).length === 0) {
      return res.status(400).json({ error: 'No sources provided.' });
    }

    const historyBlock = history.length
      ? `Conversation History:\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}\n\n`
      : '';

    const prompt = `${historyBlock}User Question: ${question}

Instructions:
- Answer ONLY based on the provided source documents.
- If the information is not present in the sources, say: "This information is not available in your uploaded study material."
- When referencing information, mention which source it came from (e.g., "According to [filename]...").
- Be concise and academically accurate.`;

    const systemInstruction = `You are an expert AI study assistant. You help students understand their uploaded study material. 
Always ground your answers in the provided source documents. Never hallucinate information not present in the sources.`;

    const answer = await generateWithSources(sources, prompt, { systemInstruction, temperature: 0.3 });
    res.json({ answer });
  } catch (err) {
    next(err);
  }
});

export default router;
