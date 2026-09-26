import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../services/api.js';
import './ToolPanel.css';

export default function StudyPlan({ sources }) {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState('');
  const [error, setError] = useState(null);
  const [days, setDays] = useState(7);
  const [hours, setHours] = useState(2);
  const [intensity, setIntensity] = useState('Balanced');

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setPlan('');

    try {
      const data = await api.studyPlan(sources, { days, hours, intensity });
      setPlan(data.plan);
    } catch (err) {
      setError(err.message || 'Failed to generate study plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-panel">
      <h2>Study Plan</h2>
      
      <div className="controls">
        <label>
          Days:
          <input type="number" value={days} min={1} max={30} onChange={e => setDays(Number(e.target.value))} />
        </label>
        <label>
          Hours/Day:
          <input type="number" value={hours} min={1} max={12} onChange={e => setHours(Number(e.target.value))} />
        </label>
        <label>
          Intensity:
          <select value={intensity} onChange={e => setIntensity(e.target.value)}>
            <option value="Light">Light</option>
            <option value="Balanced">Balanced</option>
            <option value="Intense">Intense</option>
          </select>
        </label>
        <button onClick={handleGenerate} disabled={loading} className="primary-button">
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <div className="content-display">
        {plan && <ReactMarkdown>{plan}</ReactMarkdown>}
        {!plan && !loading && !error && <p className="placeholder-text">Generate a study plan tailored to your material.</p>}
      </div>
    </div>
  );
}
