import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../services/api.js';
import './ToolPanel.css';

export default function Summary({ sources }) {
  const [type, setType] = useState('quick');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async () => {
    setLoading(true); setError(null);
    try {
      const { summary } = await api.summary(sources, type);
      setResult(summary);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <div className="tool-panel">
      <h3>Summary</h3>
      <p className="tool-desc">Generate a summary from your selected sources.</p>
      <div className="tool-options">
        {['quick', 'detailed', 'exam'].map(t => (
          <button key={t} className={`btn ${type === t ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setType(t)}>
            {t === 'quick' ? 'Quick' : t === 'detailed' ? 'Detailed' : 'Exam-Focused'}
          </button>
        ))}
      </div>
      <button className="btn btn-primary" onClick={generate} disabled={loading}>
        {loading ? <><div className="spinner" /> Generating…</> : 'Generate Summary'}
      </button>
      {error && <p className="tool-error">{error}</p>}
      {result && <div className="tool-result prose"><ReactMarkdown>{result}</ReactMarkdown></div>}
    </div>
  );
}
