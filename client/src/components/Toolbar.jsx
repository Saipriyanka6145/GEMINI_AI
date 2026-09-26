import { MessageSquare, AlignLeft, Layers, HelpCircle, Calendar, Lightbulb, Users, PanelLeftClose, PanelLeft } from 'lucide-react';
import './Toolbar.css';

const TOOLS = [
  { id: 'ask',        label: 'Ask AI',         icon: MessageSquare },
  { id: 'summary',    label: 'Summary',        icon: AlignLeft },
  { id: 'flashcards', label: 'Flashcards',     icon: Layers },
  { id: 'quiz',       label: 'Quiz',           icon: HelpCircle },
  { id: 'studyplan',  label: 'Study Plan',     icon: Calendar },
  { id: 'explain',    label: 'Explain',        icon: Lightbulb },
  { id: 'peer',       label: 'Peer Learning',  icon: Users },
];

export default function Toolbar({ activeTool, onToolChange, sidebarOpen, onToggleSidebar, sourceCount }) {
  return (
    <nav className="toolbar">
      <button className="btn btn-ghost btn-sm toolbar-sidebar-btn" onClick={onToggleSidebar}>
        {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
      </button>

      <div className="toolbar-tabs">
        {TOOLS.map(t => (
          <button
            key={t.id}
            className={`toolbar-tab ${activeTool === t.id ? 'active' : ''}`}
            onClick={() => onToolChange(t.id)}
          >
            <t.icon size={14} />
            <span className="toolbar-tab-label">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="toolbar-info">
        <span className="toolbar-source-count">{sourceCount} source{sourceCount !== 1 ? 's' : ''}</span>
      </div>
    </nav>
  );
}
