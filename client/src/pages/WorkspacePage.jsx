import { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Toolbar from '../components/Toolbar.jsx';
import AskAI from '../components/AskAI.jsx';
import Summary from '../components/Summary.jsx';
import Flashcards from '../components/Flashcards.jsx';
import Quiz from '../components/Quiz.jsx';
import StudyPlan from '../components/StudyPlan.jsx';
import ExplainConcept from '../components/ExplainConcept.jsx';
import PeerLearning from '../components/PeerLearning.jsx';
import './WorkspacePage.css';

const TOOLS = ['ask', 'summary', 'flashcards', 'quiz', 'studyplan', 'explain', 'peer'];

export default function WorkspacePage({ sources, selectedSources, onToggleSource, onRemoveSource, onAddMore }) {
  const [activeTool, setActiveTool] = useState('ask');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeSourceMap = Object.fromEntries(
    selectedSources.map(name => [name, sources[name]])
  );

  const renderTool = () => {
    if (selectedSources.length === 0) {
      return (
        <div className="no-source">
          <p>Select at least one source from the sidebar to continue.</p>
        </div>
      );
    }
    const props = { sources: activeSourceMap };
    switch (activeTool) {
      case 'ask':        return <AskAI {...props} />;
      case 'summary':    return <Summary {...props} />;
      case 'flashcards': return <Flashcards {...props} />;
      case 'quiz':       return <Quiz {...props} />;
      case 'studyplan':  return <StudyPlan {...props} />;
      case 'explain':    return <ExplainConcept {...props} />;
      case 'peer':       return <PeerLearning {...props} />;
      default:           return null;
    }
  };

  return (
    <div className="workspace">
      <Sidebar
        open={sidebarOpen}
        sources={sources}
        selectedSources={selectedSources}
        onToggle={onToggleSource}
        onRemove={onRemoveSource}
        onAddMore={onAddMore}
      />

      <div className={`workspace-content ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <Toolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(o => !o)}
          sourceCount={selectedSources.length}
        />
        <main className="tool-area">
          {renderTool()}
        </main>
      </div>
    </div>
  );
}
