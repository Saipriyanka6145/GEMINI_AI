import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../services/api.js';
import './ToolPanel.css';

export default function Notes({ sources }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async () => {
    setLoading(true); setError(null);
    try {
      const { notes } = await api.notes(sources);
      setResult(notes);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <div className="tool-panel">
      <h3>AI Notes</h3>
      <p className="tool-desc">Generate structured study notes from your sources.</p>
      <button className="btn btn-primary" onClick={generate} disabled={loading}>
        {loading ? <><div className="spinner" /> Generating…</> : 'Generate Notes'}
      </button>
      {error && <p className="tool-error">{error}</p>}
      {result && <div className="tool-result prose"><ReactMarkdown>{result}</ReactMarkdown></div>}
    </div>
  );
}
