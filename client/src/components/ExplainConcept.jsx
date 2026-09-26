import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../services/api';
import './ToolPanel.css';

export default function ExplainConcept({ sources }) {
  const [loading, setLoading] = useState(false);
  const [concept, setConcept] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState(null);

  const handleExplain = async () => {
    if (!concept.trim()) return;
    setLoading(true);
    setError(null);
    setExplanation('');

    try {
      const data = await api.explain(sources, concept, level);
      setExplanation(data.explanation);
    } catch (err) {
      setError(err.message || 'Failed to explain concept');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-panel">
      <h2>Explain Concept</h2>
      <p>Enter a concept and select a difficulty level to get an explanation grounded in your sources.</p>
      
      <div className="controls">
        <input 
          type="text" 
          value={concept} 
          onChange={e => setConcept(e.target.value)} 
          placeholder="Enter a concept (e.g. Normalization)"
          className="text-input"
        />
        <select value={level} onChange={e => setLevel(e.target.value)}>
          <option value="Beginner">Beginner (with Analogy)</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <button onClick={handleExplain} disabled={loading || !concept.trim()} className="primary-button">
          {loading ? 'Explaining...' : 'Explain'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <div className="content-display">
        {explanation && <ReactMarkdown>{explanation}</ReactMarkdown>}
        {!explanation && !loading && !error && <p className="placeholder-text">Concept explanations will appear here.</p>}
      </div>
    </div>
  );
}
