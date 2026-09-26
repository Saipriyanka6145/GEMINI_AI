const BASE = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}

export const api = {
  upload: async (files) => {
    const form = new FormData();
    files.forEach(f => form.append('files', f));
    const res = await fetch(`${BASE}/upload`, { method: 'POST', body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
  },

  chat: (sources, question, history) =>
    request('/chat', { method: 'POST', body: JSON.stringify({ sources, question, history }) }),

  summary: (sources, type) =>
    request('/summary', { method: 'POST', body: JSON.stringify({ sources, type }) }),

  flashcards: (sources, count, difficulty) =>
    request('/flashcards', { method: 'POST', body: JSON.stringify({ sources, count, difficulty }) }),

  quiz: (sources, count, difficulty) =>
    request('/quiz', { method: 'POST', body: JSON.stringify({ sources, count, difficulty }) }),

  studyPlan: (sources, params) =>
    request('/study-plan', { method: 'POST', body: JSON.stringify({ sources, ...params }) }),

  explain: (sources, concept, level) =>
    request('/explain', { method: 'POST', body: JSON.stringify({ sources, concept, level }) }),

  peerLearning: (sources, topic) =>
    request('/peer-learning', { method: 'POST', body: JSON.stringify({ sources, topic }) }),
};
