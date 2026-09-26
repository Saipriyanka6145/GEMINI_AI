import { useState } from 'react';
import HomePage from './pages/HomePage.jsx';
import WorkspacePage from './pages/WorkspacePage.jsx';

export default function App() {
  const [sources, setSources] = useState({});      // { filename: text }
  const [selectedSources, setSelectedSources] = useState([]);

  const addSources = (newSources) => {
    setSources(prev => {
      const updated = { ...prev };
      newSources.forEach(s => { updated[s.name] = s.text; });
      return updated;
    });
    setSelectedSources(prev => {
      const existing = new Set(prev);
      newSources.forEach(s => existing.add(s.name));
      return Array.from(existing);
    });
  };

  const removeSource = (name) => {
    setSources(prev => { const u = { ...prev }; delete u[name]; return u; });
    setSelectedSources(prev => prev.filter(n => n !== name));
  };

  const toggleSource = (name) => {
    setSelectedSources(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const inWorkspace = Object.keys(sources).length > 0;

  if (!inWorkspace) {
    return <HomePage onSourcesAdded={addSources} />;
  }

  return (
    <WorkspacePage
      sources={sources}
      selectedSources={selectedSources}
      onToggleSource={toggleSource}
      onRemoveSource={removeSource}
      onAddMore={addSources}
    />
  );
}
