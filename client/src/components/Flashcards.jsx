import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from 'lucide-react';
import { api } from '../services/api.js';
import './Flashcards.css';
import './ToolPanel.css';

export default function Flashcards({ sources }) {
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async () => {
    setLoading(true); setError(null);
    try {
      const { flashcards } = await api.flashcards(sources, count, difficulty);
      setCards(flashcards); setCurrent(0); setFlipped(false);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled); setCurrent(0); setFlipped(false);
  };

  if (cards.length === 0) {
    return (
      <div className="tool-panel">
        <h3>Flashcards</h3>
        <p className="tool-desc">Generate flashcards from your study material.</p>
        <div className="tool-form">
          <div className="tool-form-row">
            <div className="tool-form-field">
              <label>Number of Cards</label>
              <select className="select" value={count} onChange={e => setCount(+e.target.value)}>
                {[5, 10, 15, 20, 25].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="tool-form-field">
              <label>Difficulty</label>
              <select className="select" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>
        <button className="btn btn-primary" onClick={generate} disabled={loading}>
          {loading ? <><div className="spinner" /> Generating…</> : 'Generate Flashcards'}
        </button>
        {error && <p className="tool-error">{error}</p>}
      </div>
    );
  }

  const card = cards[current];

  return (
    <div className="tool-panel">
      <div className="fc-header">
        <h3>Flashcards</h3>
        <span className="fc-progress">Card {current + 1} / {cards.length}</span>
      </div>

      <div className={`fc-card ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(f => !f)}>
        <div className="fc-card-inner">
          <div className="fc-front">
            {card.topic && <span className="fc-topic">{card.topic}</span>}
            <p>{card.front}</p>
            <span className="fc-hint">Click to flip</span>
          </div>
          <div className="fc-back">
            <p>{card.back}</p>
          </div>
        </div>
      </div>

      <div className="fc-controls">
        <button className="btn btn-secondary btn-sm" onClick={() => { setCurrent(c => Math.max(0, c - 1)); setFlipped(false); }} disabled={current === 0}>
          <ChevronLeft size={14} /> Previous
        </button>
        <button className="btn btn-ghost btn-sm" onClick={shuffleCards}><Shuffle size={14} /></button>
        <button className="btn btn-ghost btn-sm" onClick={() => { setCurrent(0); setFlipped(false); }}><RotateCcw size={14} /></button>
        <button className="btn btn-secondary btn-sm" onClick={() => { setCurrent(c => Math.min(cards.length - 1, c + 1)); setFlipped(false); }} disabled={current === cards.length - 1}>
          Next <ChevronRight size={14} />
        </button>
      </div>

      <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => setCards([])}>Generate New Set</button>
    </div>
  );
}
