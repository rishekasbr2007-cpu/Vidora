import { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { useEditor } from '../store/EditorContext';
import CameraIcon from './CameraIcon';
import { LogOut, User, Settings } from 'lucide-react';

const MENUS = ['File', 'Edit', 'Trim', 'Timeline', 'Clip', 'Mark', 'View', 'Playback', 'Fusion', 'Color', 'Fairlight', 'Workspace', 'Help'];

import { 
  Film, Scissors, PenTool, Hexagon, Palette, Music, Package, Sparkles, LayoutDashboard 
} from 'lucide-react';

const PAGES = [
  { id: 'media',    label: 'MEDIA',     icon: <Film size={12} color="#888" /> },
  { id: 'cut',      label: 'CUT',       icon: <Scissors size={12} color="#f06292" /> },
  { id: 'edit',     label: 'EDIT',      icon: <PenTool size={12} color="#64b5f6" /> },
  { id: 'fusion',   label: 'FUSION',    icon: <Hexagon size={12} color="#ba68c8" /> },
  { id: 'color',    label: 'COLOR',     icon: <Palette size={12} color="#ffb74d" /> },
  { id: 'audio',    label: 'FAIRLIGHT', icon: <Music size={12} color="#81c784" /> },
  { id: 'deliver',  label: 'DELIVER',   icon: <Package size={12} color="#a1887f" /> },
  { id: 'creator',  label: 'CREATOR',   icon: <Sparkles size={12} color="#ffd54f" /> },
  { id: 'dashboard',label: 'DASHBOARD', icon: <LayoutDashboard size={12} color="#90a4ae" /> },
];
export default function MenuBar({ activePage, setActivePage }) {
  const { user, logout } = useAuth();
  const { 
    undo, redo, addMarker, removeClip, splitClip, selectedClipId, playheadTime,
    addTrack, play, pause, isPlaying, rewind, stepForward, stepBackward,
    setZoom, viewerFit, setViewerFit
  } = useEditor();
  const [userMenu, setUserMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <>
      {/* OS-style menu bar */}
      <div className="menubar">
        <div className="menubar-logo">
          <CameraIcon size={18} />
          <span className="menubar-logo-text">Vidora</span>
        </div>

        {MENUS.map(m => (
          <div key={m} style={{ position: 'relative' }}>
            <div
              className="menu-item"
              onMouseEnter={() => activeMenu && setActiveMenu(m)}
              onClick={() => setActiveMenu(activeMenu === m ? null : m)}
            >
              {m}
            </div>
            {activeMenu === m && (
              <div style={{ position: 'absolute', top: '100%', left: 0, background: '#2a2a2a', border: '1px solid #444', borderRadius: 4, padding: '4px 0', minWidth: 160, zIndex: 1000, boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
                {m === 'File' && (
                  <>
                    <div className="menu-item" onClick={() => { document.querySelector('input[type="file"]')?.click(); setActiveMenu(null); }}>Import Media...</div>
                    <div className="menu-item" onClick={() => setActiveMenu(null)}>New Project</div>
                    <div className="menu-item" onClick={() => setActiveMenu(null)}>Save Project</div>
                  </>
                )}
                {m === 'Edit' && (
                  <>
                    <div className="menu-item" onClick={() => { undo(); setActiveMenu(null); }}>Undo</div>
                    <div className="menu-item" onClick={() => { redo(); setActiveMenu(null); }}>Redo</div>
                    <div className="menu-item" onClick={() => { if (selectedClipId) removeClip(selectedClipId); setActiveMenu(null); }}>Delete Selected</div>
                  </>
                )}
                {m === 'Trim' && (
                  <>
                    <div className="menu-item" onClick={() => { if (selectedClipId) splitClip(selectedClipId, playheadTime); setActiveMenu(null); }}>Split Clip at Playhead</div>
                    <div className="menu-item" onClick={() => { document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyB' })); setActiveMenu(null); }}>Blade Tool</div>
                    <div className="menu-item" onClick={() => { document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyS' })); setActiveMenu(null); }}>Snapping</div>
                  </>
                )}
                {m === 'Timeline' && (
                  <>
                    <div className="menu-item" onClick={() => { addTrack('video'); setActiveMenu(null); }}>Add Video Track</div>
                    <div className="menu-item" onClick={() => { addTrack('audio'); setActiveMenu(null); }}>Add Audio Track</div>
                  </>
                )}
                {m === 'Clip' && (
                  <>
                    <div className="menu-item" onClick={() => { if (selectedClipId) splitClip(selectedClipId, playheadTime); setActiveMenu(null); }}>Split Selected</div>
                    <div className="menu-item" onClick={() => { if (selectedClipId) removeClip(selectedClipId); setActiveMenu(null); }}>Delete Selected</div>
                  </>
                )}
                {m === 'Mark' && (
                  <>
                    <div className="menu-item" onClick={() => { addMarker(); setActiveMenu(null); }}>Add Marker</div>
                  </>
                )}
                {m === 'View' && (
                  <>
                    <div className="menu-item" onClick={() => { setZoom(z => Math.min(z + 0.2, 5)); setActiveMenu(null); }}>Zoom Timeline In</div>
                    <div className="menu-item" onClick={() => { setZoom(z => Math.max(z - 0.2, 0.2)); setActiveMenu(null); }}>Zoom Timeline Out</div>
                    <div className="menu-item" onClick={() => { setViewerFit('fit'); setActiveMenu(null); }}>Viewer: Fit</div>
                    <div className="menu-item" onClick={() => { setViewerFit('100%'); setActiveMenu(null); }}>Viewer: 100%</div>
                  </>
                )}
                {m === 'Playback' && (
                  <>
                    <div className="menu-item" onClick={() => { isPlaying ? pause() : play(); setActiveMenu(null); }}>{isPlaying ? 'Pause' : 'Play'}</div>
                    <div className="menu-item" onClick={() => { rewind(); setActiveMenu(null); }}>Rewind</div>
                    <div className="menu-item" onClick={() => { stepForward(); setActiveMenu(null); }}>Step Forward</div>
                    <div className="menu-item" onClick={() => { stepBackward(); setActiveMenu(null); }}>Step Backward</div>
                  </>
                )}
                {!['File', 'Edit', 'Trim', 'Timeline', 'Clip', 'Mark', 'View', 'Playback'].includes(m) && (
                  <div className="menu-item" style={{ color: '#888' }} onClick={() => setActiveMenu(null)}>{m} options...</div>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="menubar-right">
          <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'#888', marginRight: 10 }}>
            {user?.username || 'Guest'}
          </span>
          <div style={{ position:'relative' }}>
            <div
              style={{
                width:22, height:22, borderRadius:'50%',
                background:'linear-gradient(135deg,#7a3a9a,#e05a2b)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:11, fontWeight:700, color:'#fff', cursor:'pointer'
              }}
              onClick={() => setUserMenu(v => !v)}
            >
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            {userMenu && (
              <div style={{
                position:'absolute', right:0, top:'calc(100%+4px)',
                background:'#2a2a2a', border:'1px solid #444', borderRadius:4,
                padding:'4px', minWidth:160, zIndex:500, boxShadow:'0 4px 20px rgba(0,0,0,0.6)',
                marginTop:4,
              }}>
                <div style={{ padding:'6px 10px', borderBottom:'1px solid #333', marginBottom:4 }}>
                  <div style={{ fontSize:11, fontWeight:600, color:'#eee' }}>{user?.username}</div>
                  <div style={{ fontSize:10, color:'#666' }}>{user?.email}</div>
                </div>
                <div className="menu-item" style={{ display:'flex', alignItems:'center', gap:6 }}
                  onClick={() => { setActivePage('creator'); setUserMenu(false); }}>
                  <User size={11}/> Creator Space
                </div>
                <div className="menu-item" style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <Settings size={11}/> Settings
                </div>
                <div style={{ borderTop:'1px solid #333', marginTop:4, paddingTop:4 }}>
                  <div className="menu-item"
                    style={{ color:'#e05a2b', display:'flex', alignItems:'center', gap:6 }}
                    onClick={logout}>
                    <LogOut size={11}/> Sign Out
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DaVinci page tabs toolbar */}
      <div className="toolbar">
        {/* Left tools */}
        <button className="btn-icon" onClick={undo} title="Undo (Ctrl+Z)">↩</button>
        <button className="btn-icon" onClick={redo} title="Redo (Ctrl+Shift+Z)">↪</button>
        <div className="toolbar-sep" />
        <button className="btn-icon" onClick={addMarker} title="Marker (M)">⬦</button>
        <button className="btn-icon" title="Flag">⚑</button>
        <div className="toolbar-sep" />

        {/* Center: page tabs */}
        <div className="toolbar-pages">
          {PAGES.map(p => (
            <button
              key={p.id}
              className={`toolbar-page ${activePage === p.id ? 'active' : ''}`}
              onClick={() => setActivePage(p.id)}
            >
              {p.icon}
              {p.label}
            </button>
          ))}
        </div>

        {/* Right tools */}
        <button className="btn-icon" title="Quick Export">⊞</button>
        <button className="btn-icon" title="Timeline">≡</button>
        <button className="btn-icon" title="Nodes">⊛</button>
        <button className="btn-icon" title="Effects">✦</button>
      </div>
    </>
  );
}
