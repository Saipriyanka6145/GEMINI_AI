import { useState, useCallback, useRef } from 'react';
import { FileText, File, Check, X, Brain, Plus } from 'lucide-react';
import { api } from '../services/api.js';
import './Sidebar.css';

export default function Sidebar({ open, sources, selectedSources, onToggle, onRemove, onAddMore }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleUpload = useCallback(async (files) => {
    const valid = Array.from(files).filter(f => f.name.endsWith('.pdf') || f.name.endsWith('.txt'));
    if (!valid.length) return;
    setUploading(true);
    try {
      const { sources: newSources } = await api.upload(valid);
      onAddMore(newSources);
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  }, [onAddMore]);

  if (!open) return null;

  const names = Object.keys(sources);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Brain size={18} strokeWidth={1.5} className="sidebar-logo-icon" />
        <span className="sidebar-title">Sources</span>
        <span className="sidebar-count">{selectedSources.length}/{names.length}</span>
      </div>

      <div className="sidebar-sources">
        {names.map(name => {
          const ext = name.split('.').pop().toLowerCase();
          const selected = selectedSources.includes(name);
          return (
            <div key={name} className={`source-item ${selected ? 'selected' : ''}`} onClick={() => onToggle(name)}>
              <div className="source-check">
                {selected ? <Check size={12} /> : <div className="source-check-empty" />}
              </div>
              <div className="source-icon">
                {ext === 'pdf' ? <FileText size={14} /> : <File size={14} />}
              </div>
              <div className="source-info">
                <span className="source-name" title={name}>{name}</span>
                <span className={`badge badge-${ext}`}>{ext.toUpperCase()}</span>
              </div>
              <button
                className="source-remove"
                onClick={(e) => { e.stopPropagation(); onRemove(name); }}
                title="Remove source"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.txt"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleUpload(e.target.files)}
        />
        <button
          className="btn btn-secondary btn-sm sidebar-add-btn"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <div className="spinner" style={{width:14,height:14}} /> : <Plus size={14} />}
          {uploading ? 'Uploading…' : 'Add Source'}
        </button>
      </div>
    </aside>
  );
}
