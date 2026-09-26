import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { api } from '../services/api.js';
import './AskAI.css';

export default function AskAI({ sources }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setError(null);

    const userMsg = { role: 'user', content: q };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const { answer } = await api.chat(sources, q, history);
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Ask AI</h3>
        {messages.length > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setMessages([]); setError(null); }}>
            <Trash2 size={13} /> Clear
          </button>
        )}
      </div>

      <div className="chat-messages">
        {messages.length === 0 && !loading && (
          <div className="chat-empty">
            <Bot size={32} strokeWidth={1.2} />
            <p>Ask any question about your study material.</p>
            <p className="chat-empty-hint">Your AI responses are grounded in the selected sources.</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            <div className="chat-msg-avatar">
              {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className="chat-msg-body prose">
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-msg assistant">
            <div className="chat-msg-avatar"><Bot size={14} /></div>
            <div className="chat-msg-body"><div className="typing-dots"><span /><span /><span /></div></div>
          </div>
        )}

        {error && <p className="chat-error">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <form className="chat-input-bar" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <input
          className="input chat-input"
          placeholder="Ask about your study material…"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
