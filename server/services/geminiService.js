import { GoogleGenAI } from '@google/genai';

let _client = null;

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API is not configured. Set GEMINI_API_KEY in .env');
  }
  if (!_client) {
    _client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return _client;
}

const MODEL = 'gemini-2.0-flash';

function buildSourceContext(sources) {
  if (!sources || Object.keys(sources).length === 0) return '';
  return Object.entries(sources)
    .map(([name, content]) => `=== Source: ${name} ===\n${content}`)
    .join('\n\n');
}

export async function generateText(prompt, { systemInstruction, temperature = 0.4, asJson = false } = {}) {
  const client = getClient();
  const config = { temperature };
  if (systemInstruction) config.systemInstruction = systemInstruction;
  if (asJson) config.responseMimeType = 'application/json';

  const response = await client.models.generateContent({
    model: MODEL,
    contents: prompt,
    config,
  });
  return response.text;
}

export async function generateWithSources(sources, userPrompt, options = {}) {
  const context = buildSourceContext(sources);
  const fullPrompt = context
    ? `${context}\n\n---\n\n${userPrompt}`
    : userPrompt;
  return generateText(fullPrompt, options);
}
