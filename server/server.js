import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import uploadRouter from './routes/upload.js';
import chatRouter from './routes/chat.js';
import summaryRouter from './routes/summary.js';
import notesRouter from './routes/notes.js';
import flashcardsRouter from './routes/flashcards.js';
import quizRouter from './routes/quiz.js';
import studyPlanRouter from './routes/studyPlan.js';
import explainRouter from './routes/explain.js';
import peerLearningRouter from './routes/peerLearning.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  const keyLoaded = Boolean(process.env.GEMINI_API_KEY);
  res.json({ status: 'ok', geminiConfigured: keyLoaded });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/upload', uploadRouter);
app.use('/api/chat', chatRouter);
app.use('/api/summary', summaryRouter);
app.use('/api/notes', notesRouter);
app.use('/api/flashcards', flashcardsRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/study-plan', studyPlanRouter);
app.use('/api/explain', explainRouter);
app.use('/api/peer-learning', peerLearningRouter);

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[server error]', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  const keyLoaded = Boolean(process.env.GEMINI_API_KEY);
  console.log(`[server] Running on http://localhost:${PORT}`);
  console.log(`[server] GEMINI KEY LOADED: ${keyLoaded}`);
});
