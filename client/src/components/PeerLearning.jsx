import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../services/api';
import './ToolPanel.css';

export default function PeerLearning({ sources }) {
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [guide, setGuide] = useState('');
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);
    setGuide('');

    try {
      const data = await api.peerLearning(sources, topic);
      setGuide(data.guide);
    } catch (err) {
      setError(err.message || 'Failed to generate peer learning guide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-panel">
      <h2>Peer Learning Prep</h2>
      <p>Prepare to teach a topic to your classmates. We will generate an explanation, an analogy, key takeaways, and discussion questions.</p>
      
      <div className="controls">
        <input 
          type="text" 
          value={topic} 
          onChange={e => setTopic(e.target.value)} 
          placeholder="Enter a topic to teach..."
          className="text-input"
        />
        <button onClick={handleGenerate} disabled={loading || !topic.trim()} className="primary-button">
          {loading ? 'Preparing...' : 'Prepare Guide'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <div className="content-display">
        {guide && <ReactMarkdown>{guide}</ReactMarkdown>}
        {!guide && !loading && !error && <p className="placeholder-text">Your teaching guide will appear here.</p>}
      </div>
    </div>
  );
}
