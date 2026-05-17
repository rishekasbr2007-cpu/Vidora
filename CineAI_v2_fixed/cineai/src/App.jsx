import { useState } from 'react';
import { AuthProvider, useAuth } from './store/AuthContext';
import MenuBar from './components/MenuBar';
import Editor from './pages/Editor';
import CreatorSpace from './pages/CreatorSpace';
import Dashboard from './pages/Dashboard';
import { EditorProvider, useEditor } from './store/EditorContext';
import { ProjectProvider } from './store/ProjectContext';
import ColorWheel from './components/ColorWheel';
import Viewer from './components/Viewer';
import Timeline from './components/Timeline';
import Transport from './components/Transport';
import Inspector from './components/Inspector';
import AuthPage from './pages/AuthPage';
import AudioMixer from './components/AudioMixer';
import LeftSidebar from './components/LeftSidebar';

// Color grading placeholder page
import KeyframeEditor from './components/KeyframeEditor';
import { Sliders, Camera, Wind, Zap } from 'lucide-react';

function ColorPage() {
  const { selectedClip, updateClip, clips, playheadTime } = useEditor();
  const activeClip = selectedClip || clips.find(c => c.track.startsWith('V') && playheadTime >= c.startTime && playheadTime <= c.startTime + c.duration);

  const handleWheelChange = (key, val) => {
    updateClip(activeClip.id, { [key]: val });
  };

  const handleInput = (key, val) => {
    updateClip(activeClip.id, { [key]: parseFloat(val) });
  };

  if (!activeClip) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'var(--dv-text-muted)', background: 'var(--dv-bg)' }}>
        <div style={{ fontSize: 32 }}>🎨</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dv-text-dim)' }}>Color Grading</div>
        <div style={{ fontSize: 11 }}>Select or place a clip under the playhead to begin grading</div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--dv-bg)', overflow: 'hidden' }}>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ flex: 3, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--dv-border)' }}>
          <Viewer mode="timeline" />
          <Transport />
        </div>
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
           <div style={{ flex: 1, background: '#050508', borderBottom: '1px solid var(--dv-border-dark)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 28, background: 'var(--dv-panel)', borderBottom: '1px solid var(--dv-border-dark)', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--dv-text-muted)', textTransform: 'uppercase' }}>Scopes</span>
              </div>
              <div style={{ flex: 1, position: 'relative', padding: 10 }}>
                 <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,80 Q25,20 50,50 T100,20" stroke="var(--dv-blue)" fill="none" strokeWidth="0.5" opacity="0.6" />
                    <path d="M0,90 Q30,40 60,70 T100,40" stroke="var(--track-a-light)" fill="none" strokeWidth="0.5" opacity="0.6" />
                    <path d="M0,70 Q20,30 40,60 T100,10" stroke="var(--dv-accent)" fill="none" strokeWidth="0.5" opacity="0.6" />
                 </svg>
              </div>
           </div>
           <div style={{ flex: 1 }}><KeyframeEditor /></div>
        </div>
      </div>

      <div style={{ height: 340, display: 'flex', borderTop: '1px solid var(--dv-border-dark)', background: 'var(--dv-panel-dark)' }}>
        <div style={{ width: 280, borderRight: '1px solid var(--dv-border-dark)', display: 'flex', flexDirection: 'column' }}>
           <div style={{ height: 32, borderBottom: '1px solid var(--dv-border-dark)', display: 'flex', gap: 10, padding: '0 10px', alignItems: 'center' }}>
              <button className="btn-icon-dim active"><Camera size={12}/></button>
              <button className="btn-icon-dim"><Sliders size={12}/></button>
              <button className="btn-icon-dim"><Wind size={12}/></button>
              <button className="btn-icon-dim"><Zap size={12}/></button>
           </div>
           <div style={{ flex: 1, padding: 12, overflowY: 'auto' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#666', marginBottom: 12 }}>CAMERA RAW</div>
              {[
                ['Color Temp', 'temperature', 2000, 50000, 100],
                ['Tint', 'tint', -50, 50, 1],
                ['Exposure', 'exposure', -5, 5, 0.1],
                ['Sharpness', 'sharpness', 0, 100, 1],
                ['Contrast', 'contrast', 0, 200, 1],
              ].map(([label, key, min, max, step]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 10, color: '#aaa' }}>{label}</span>
                  <input type="number" step={step} value={activeClip[key] || 0} onChange={e => handleInput(key, e.target.value)} style={{ width: 45, background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: 'var(--dv-blue)', fontSize: 10, textAlign: 'right' }} />
                </div>
              ))}
           </div>
        </div>

        <div style={{ flex: 3, padding: '16px 20px', borderRight: '1px solid var(--dv-border-dark)', overflowX: 'auto' }}>
           <div style={{ fontSize: 10, fontWeight: 800, color: '#666', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 }}>High Dynamic Range - Color Wheels</div>
           <div style={{ display: 'flex', gap: 30, minWidth: 600 }}>
              <ColorWheel label="Dark" value={activeClip.hdrDark || {x:0, y:0}} exp={activeClip.hdrDarkExp || 0} sat={activeClip.hdrDarkSat || 1} onChange={v => handleWheelChange('hdrDark', v)} onExpChange={v => handleWheelChange('hdrDarkExp', v)} onSatChange={v => handleWheelChange('hdrDarkSat', v)} />
              <ColorWheel label="Shadow" value={activeClip.hdrShadow || {x:0, y:0}} exp={activeClip.hdrShadowExp || 0} sat={activeClip.hdrShadowSat || 1} onChange={v => handleWheelChange('hdrShadow', v)} onExpChange={v => handleWheelChange('hdrShadowExp', v)} onSatChange={v => handleWheelChange('hdrShadowSat', v)} />
              <ColorWheel label="Light" value={activeClip.hdrLight || {x:0, y:0}} exp={activeClip.hdrLightExp || 0} sat={activeClip.hdrLightSat || 1} onChange={v => handleWheelChange('hdrLight', v)} onExpChange={v => handleWheelChange('hdrLightExp', v)} onSatChange={v => handleWheelChange('hdrLightSat', v)} />
              <ColorWheel label="Global" value={activeClip.hdrGlobal || {x:0, y:0}} exp={activeClip.hdrGlobalExp || 0} sat={activeClip.hdrGlobalSat || 1} onChange={v => handleWheelChange('hdrGlobal', v)} onExpChange={v => handleWheelChange('hdrGlobalExp', v)} onSatChange={v => handleWheelChange('hdrGlobalSat', v)} />
            </div>
        </div>
      </div>
    </div>
  );
}

function AudioPage() {
  const { AUDIO_TRACKS, OPENFX } = useEditor();
  const audioFX = OPENFX.filter(f => f.cat === 'Retouch' || f.id.includes('noise'));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--dv-bg)', overflow: 'hidden' }}>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ width: 260, borderRight: '1px solid var(--dv-border)', background: 'var(--dv-panel-dark)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 28, background: 'var(--dv-panel)', borderBottom: '1px solid var(--dv-border-dark)', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--dv-text-muted)', textTransform: 'uppercase' }}>Audio FX</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
               {['DYNAMICS', 'EQ', 'REVERB', 'RESTORATION'].map(cat => (
                 <div key={cat} style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: '#444', marginBottom: 6 }}>{cat}</div>
                    {cat === 'RESTORATION' ? audioFX.map(f => (
                       <div key={f.id} style={{ padding: '4px 10px', fontSize: 11, color: '#888', borderBottom: '1px solid #1a1a1a', cursor: 'pointer' }}>{f.name}</div>
                    )) : ['Compressor', 'Limiter', 'EQ 6-Band', 'Reverb'].map(t => (
                       <div key={t} style={{ padding: '4px 10px', fontSize: 11, color: '#888', borderBottom: '1px solid #1a1a1a', cursor: 'pointer' }}>{t}</div>
                    ))}
                 </div>
               ))}
            </div>
        </div>
        <div style={{ flex: 3, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--dv-border)' }}>
          <Viewer mode="timeline" />
          <Transport />
        </div>
        <AudioMixer />
      </div>
      <div style={{ height: 280, display: 'flex', borderTop: '1px solid var(--dv-border-dark)' }}><Timeline /></div>
    </div>
  );
}

function FusionPage() {
  const { selectedClip, FUSION_NODES, clips, playheadTime } = useEditor();
  const activeClip = selectedClip || clips.find(c => c.track.startsWith('V') && playheadTime >= c.startTime && playheadTime <= c.startTime + c.duration);

  if (!activeClip) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'var(--dv-text-muted)', background: 'var(--dv-bg)' }}>
        <div style={{ fontSize: 32 }}>⬡</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dv-text-dim)' }}>Fusion VFX</div>
        <div style={{ fontSize: 11 }}>Select or place a clip under the playhead to add visual effects nodes</div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--dv-bg)', overflow: 'hidden' }}>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <LeftSidebar />
        <div style={{ width: 240, borderRight: '1px solid var(--dv-border)', background: 'var(--dv-panel-dark)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ height: 28, background: 'var(--dv-panel)', borderBottom: '1px solid var(--dv-border-dark)', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--dv-text-muted)', textTransform: 'uppercase' }}>Nodes</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
               {FUSION_NODES.map(n => (
                   <div key={n.id} style={{ padding: '6px 10px', fontSize: 11, color: 'var(--dv-text-dim)', borderBottom: '1px solid #222', cursor: 'grab', display: 'flex', justifyContent: 'space-between' }}>
                     {n.name} <span style={{ fontSize: 8, opacity: 0.3 }}>{n.cat}</span>
                   </div>
               ))}
            </div>
        </div>
        <div style={{ flex: 3, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
           <div style={{ flex: 2, borderBottom: '1px solid var(--dv-border)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', overflow: 'hidden' }}>
             <div style={{ width: '100%', height: '100%', maxHeight: '100%', aspectRatio: '16/9', position: 'relative' }}>
               <Viewer />
             </div>
           </div>
           <div style={{ flex: 3, background: '#050508', position: 'relative', overflow: 'hidden' }}>
             <div style={{ height: 28, background: 'var(--dv-panel)', borderBottom: '1px solid var(--dv-border-dark)', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--dv-text-muted)', textTransform: 'uppercase' }}>Node Graph</span>
             </div>
             <div style={{ position: 'absolute', inset: 0, top: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
                    <div style={{ width: 80, height: 45, background: '#1c1c28', border: '1px solid var(--dv-blue)', borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 10 }}>MediaIn1</div>
                    <div style={{ width: 80, height: 45, background: '#281c1c', border: '1px solid var(--dv-accent)', borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 10 }}>Merge1</div>
                    <div style={{ width: 80, height: 45, background: '#1c1c28', border: '1px solid #555', borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 10 }}>MediaOut1</div>
                </div>
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <line x1="39%" y1="50%" x2="47%" y2="50%" stroke="#555" strokeWidth="1" />
                    <line x1="53%" y1="50%" x2="61%" y2="50%" stroke="#555" strokeWidth="1" />
                </svg>
             </div>
           </div>
        </div>
        <div style={{ width: 280, background: 'var(--dv-panel-dark)', borderLeft: '1px solid var(--dv-border-dark)' }}><Inspector /></div>
      </div>
      <div style={{ height: 180, display: 'flex', borderTop: '1px solid var(--dv-border-dark)' }}>
        <Timeline />
      </div>
    </div>
  );
}

function DeliverPage() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, color: 'var(--dv-text-muted)', background: 'var(--dv-bg)' }}>
      <div style={{ fontSize: 32 }}>📦</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dv-text-dim)' }}>Deliver / Export</div>
      <div style={{ background: 'var(--dv-panel)', border: '1px solid var(--dv-border)', borderRadius: 6, padding: '24px 40px', display: 'flex', flexDirection: 'column', gap: 16, minWidth: 400 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--dv-text-bright)', marginBottom: 4 }}>RENDER SETTINGS</div>
        {[['Filename', 'Vidora_Project_01'], ['Location', '/Users/Roshan/Videos'], ['Format', 'MP4 (H.264)'], ['Resolution', '1920 × 1080 (HD)'], ['Frame Rate', '24 fps'], ['Audio', 'AAC 320kbps Stereo']].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, borderBottom: '1px solid #333', paddingBottom: 6 }}>
            <span style={{ color: 'var(--dv-text-muted)' }}>{k}</span>
            <span style={{ color: 'var(--dv-text)', fontFamily: 'var(--font-mono)' }}>{v}</span>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button className="btn" style={{ flex: 1, justifyContent: 'center' }}>Add to Render Queue</button>
            <button className="btn btn-accent" style={{ flex: 1, justifyContent: 'center' }}>Start Render</button>
        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1117', flexDirection: 'column', gap: 16 }}>
      <svg width="60" height="60" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="18" fill="#111"/>
        <rect x="11" y="13" width="78" height="56" rx="3" fill="#0d1117"/>
        <text x="50" y="49" fontFamily="monospace" fontSize="8" fill="#58a6ff" textAnchor="middle">npm run dev</text>
        <rect x="20" y="55" width="60" height="2" rx="1" fill="#1f3a5f"/>
        <rect x="20" y="55" width="40" height="2" rx="1" fill="#58a6ff">
          <animate attributeName="width" from="0" to="60" dur="1.2s" repeatCount="indefinite"/>
        </rect>
      </svg>
      <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#58a6ff', letterSpacing: 2 }}>VIDORA</div>
      <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#444' }}>Starting editor…</div>
    </div>
  );
}


function AppInner() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('edit');

  if (loading) return <LoadingScreen />;

  // Auth Wall
  if (!user) {
    return <AuthPage />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'creator':   return <CreatorSpace />;
      case 'dashboard': return <Dashboard setActivePage={setActivePage} />;
      case 'color':     return <ColorPage />;
      case 'audio':     return <AudioPage />;
      case 'deliver':   return <DeliverPage />;
      case 'fusion':    return <FusionPage />;
      case 'media':
      case 'cut':
      case 'edit':
      default:          return <Editor />;
    }
  };

  return (
    <div className="app-root">
      <MenuBar activePage={activePage} setActivePage={setActivePage} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {renderPage()}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <EditorProvider>
          <AppInner />
        </EditorProvider>
      </ProjectProvider>
    </AuthProvider>
  );
}
