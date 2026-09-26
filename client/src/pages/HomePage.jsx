import { useState, useCallback } from 'react';
import { Upload, FileText, Zap, BookOpen, Brain } from 'lucide-react';
import { api } from '../services/api.js';
import './HomePage.css';

export default function HomePage({ onSourcesAdded }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const processFiles = useCallback(async (files) => {
    const valid = Array.from(files).filter(f =>
      f.name.endsWith('.pdf') || f.name.endsWith('.txt')
    );
    if (!valid.length) {
      setError('Please upload PDF or TXT files only.');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const { sources } = await api.upload(valid);
      onSourcesAdded(sources);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }, [onSourcesAdded]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  return (
    <div className="homepage">
      <header className="home-header">
        <div className="home-logo">
          <Brain size={22} strokeWidth={1.5} />
          <span>Gemini Campus</span>
        </div>
      </header>

      <main className="home-main">
        <section className="hero">
          <div className="hero-badge">
            <Zap size={12} />
            Powered by Gemini AI
          </div>
          <h1 className="hero-title">
            Turn your study material<br />
            into an AI workspace.
          </h1>
          <p className="hero-sub">
            Upload lecture notes, textbooks, or PDFs. Ask questions, generate summaries,
            create flashcards, take quizzes, and study smarter — all from your own material.
          </p>

          <div
            className={`upload-zone ${dragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => !uploading && document.getElementById('file-input').click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".pdf,.txt"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => processFiles(e.target.files)}
            />
            {uploading ? (
              <div className="upload-loading">
                <div className="spinner" />
                <p>Processing your files…</p>
              </div>
            ) : (
              <div className="upload-idle">
                <div className="upload-icon">
                  <Upload size={28} strokeWidth={1.5} />
                </div>
                <p className="upload-cta">Add Study Material</p>
                <p className="upload-hint">
                  Drag & drop files here, or click to browse
                </p>
                <div className="upload-formats">
                  <span className="badge badge-pdf">PDF</span>
                  <span className="badge badge-txt">TXT</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Multiple files supported</span>
                </div>
              </div>
            )}
          </div>

          {error && <p className="upload-error">{error}</p>}
        </section>

        <section className="features">
          {[
            { icon: <BookOpen size={16} />, title: 'Ask AI', desc: 'Chat with your documents. Get answers grounded in your material.' },
            { icon: <FileText size={16} />, title: 'Summarize & Notes', desc: 'Quick summaries, detailed notes, and exam-focused outlines.' },
            { icon: <Brain size={16} />, title: 'Flashcards & Quiz', desc: 'Auto-generated flashcards and MCQ quizzes from your sources.' },
            { icon: <Zap size={16} />, title: 'Study Plan', desc: 'Personalized study schedule based on your uploaded material.' },
          ].map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div>
                <p className="feature-title">{f.title}</p>
                <p className="feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
