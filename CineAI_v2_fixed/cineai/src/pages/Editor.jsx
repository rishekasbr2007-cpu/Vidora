import { useState } from 'react';
import LeftSidebar from '../components/LeftSidebar';
import Timeline from '../components/Timeline';
import Transport from '../components/Transport';
import Inspector from '../components/Inspector';
import Viewer from '../components/Viewer';
import FXPanel from '../components/FXPanel';
import AIPanel from '../components/AIPanel';
import { Sparkles, Activity, List as ListIcon, Info } from 'lucide-react';
import { useEditor } from '../store/EditorContext';

export default function Editor() {
  return <EditWorkspace />;
}

function EditWorkspace() {
  const [showAI, setShowAI] = useState(false);
  const [showInspector, setShowInspector] = useState(true);
  const [showMediaPool, setShowMediaPool] = useState(true);

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: `${showMediaPool ? '260px' : '0px'} 1fr ${showInspector ? '300px' : '0px'}`, 
      gridTemplateRows: '1fr 280px',
      height: '100%', 
      width: '100%',
      overflow: 'hidden', 
      background: 'var(--dv-bg)',
      transition: 'grid-template-columns 0.2s ease'
    }}>
      {/* Left: Media Pool */}
      <div style={{ gridRow: '1 / 2', borderRight: '1px solid var(--dv-border-dark)', overflow: 'hidden', display: showMediaPool ? 'block' : 'none' }}>
        <LeftSidebar />
      </div>

      {/* Center: Dual Viewers */}
      <div style={{ 
        gridRow: '1 / 2', 
        gridColumn: showMediaPool ? '2 / 3' : '1 / 3', 
        display: 'flex', 
        flexDirection: 'column', 
        minWidth: 0, 
        borderRight: showInspector ? '1px solid var(--dv-border-dark)' : 'none' 
      }}>
        {/* Toolbar for the center section */}
        <div style={{ height: 32, background: 'var(--dv-panel)', borderBottom: '1px solid var(--dv-border-dark)', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 10 }}>
           <button className={`btn-icon-dim ${showMediaPool ? 'active' : ''}`} onClick={() => setShowMediaPool(!showMediaPool)} title="Media Pool"><Activity size={12}/></button>
           <button className="btn-icon-dim" title="Effects"><Sparkles size={12}/></button>
           <div style={{ flex: 1 }} />
           <button className={`btn-icon-dim ${showInspector ? 'active' : ''}`} onClick={() => setShowInspector(!showInspector)} title="Inspector"><Info size={12}/></button>
        </div>

        {/* Dual Viewers Row */}
        <div style={{ flex: 1, display: 'flex', gap: 1, background: '#111', padding: '1px 0', overflow: 'hidden' }}>
           <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', borderRight: '1px solid #111' }}>
             <Viewer mode="source" />
           </div>
           <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
             <Viewer mode="timeline" />
           </div>
        </div>
        <Transport />
      </div>

      {/* Right: Inspector */}
      <div style={{ gridRow: '1 / 2', gridColumn: '3 / 4', overflow: 'hidden', background: 'var(--dv-panel-dark)', display: showInspector ? 'block' : 'none' }}>
        <Inspector />
      </div>

      {/* Bottom: Timeline & FX */}
      <div style={{ 
        gridRow: '2 / 3', 
        gridColumn: '1 / 4', 
        display: 'flex', 
        borderTop: '1px solid var(--dv-border-dark)',
        overflow: 'hidden' 
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Timeline />
        </div>
        <div style={{ width: 300, borderLeft: '1px solid var(--dv-border-dark)' }}>
          <FXPanel />
        </div>
      </div>

      {/* AI Panel overlay */}
      {showAI && <AIPanel onClose={() => setShowAI(false)} />}

      {/* AI toggle button */}
      <button
        onClick={() => setShowAI(v => !v)}
        className="ai-toggle-btn"
        style={{
          position: 'absolute', bottom: 300, left: 10,
          background: showAI ? 'var(--dv-panel-light)' : 'linear-gradient(135deg, #7a3a9a, #e05a2b)',
          border: '1px solid var(--dv-border)',
          borderRadius: '50%', width: 36, height: 36,
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 201, boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
        title="Toggle AI Video Generator"
      >
        <Sparkles size={16} />
      </button>
    </div>
  );
}
