import { useState } from 'react';
import { useEditor } from '../store/EditorContext';
import { Search, Grid, List, Sparkles } from 'lucide-react';

export default function FXPanel() {
  const { selectedClip, applyEffect, OPENFX, VIDEO_TRANSITIONS } = useEditor();
  const [tab, setTab] = useState('effects');
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');

  const CATS = ['All', ...new Set(OPENFX.map(e => e.cat))];

  const filtered = OPENFX.filter(e =>
    (cat === 'All' || e.cat === cat) &&
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const groups = {};
  filtered.forEach(e => { if (!groups[e.cat]) groups[e.cat] = []; groups[e.cat].push(e); });

  const dragStartFX = (e, fx) => {
    e.dataTransfer.setData('effectId', fx.id);
    e.dataTransfer.setData('effectName', fx.name);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="fx-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--dv-panel-dark)' }}>
      <div className="fx-panel-header" style={{ padding: '8px 12px', borderBottom: '1px solid var(--dv-border-dark)', fontSize: 11, fontWeight: 700, color: 'var(--dv-text-bright)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        Effects Library
      </div>

      <div className="fx-tabs" style={{ display: 'flex', borderBottom: '1px solid var(--dv-border-dark)' }}>
        <button className={`fx-tab ${tab === 'effects' ? 'active' : ''}`} onClick={() => setTab('effects')} style={{ flex: 1, padding: '8px 0', border: 'none', background: 'transparent', color: tab === 'effects' ? 'var(--dv-accent)' : 'var(--dv-text-muted)', fontSize: 10, fontWeight: 600, cursor: 'pointer', borderBottom: `2px solid ${tab === 'effects' ? 'var(--dv-accent)' : 'transparent'}` }}>Effects</button>
        <button className={`fx-tab ${tab === 'trans'   ? 'active' : ''}`} onClick={() => setTab('trans')} style={{ flex: 1, padding: '8px 0', border: 'none', background: 'transparent', color: tab === 'trans' ? 'var(--dv-accent)' : 'var(--dv-text-muted)', fontSize: 10, fontWeight: 600, cursor: 'pointer', borderBottom: `2px solid ${tab === 'trans' ? 'var(--dv-accent)' : 'transparent'}` }}>Transitions</button>
        <button className={`fx-tab ${tab === 'fusion'  ? 'active' : ''}`} onClick={() => setTab('fusion')} style={{ flex: 1, padding: '8px 0', border: 'none', background: 'transparent', color: tab === 'fusion' ? 'var(--dv-accent)' : 'var(--dv-text-muted)', fontSize: 10, fontWeight: 600, cursor: 'pointer', borderBottom: `2px solid ${tab === 'fusion' ? 'var(--dv-accent)' : 'transparent'}` }}>Fusion</button>
      </div>

      {tab === 'effects' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: 8, display: 'flex', gap: 6, alignItems: 'center', borderBottom: '1px solid var(--dv-border-dark)' }}>
             <div style={{ position: 'relative', flex: 1 }}>
                <Search size={12} style={{ position: 'absolute', left: 8, top: 8, color: '#555' }} />
                <input
                  type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search tools..."
                  style={{ width: '100%', padding: '6px 8px 6px 28px', background: 'var(--dv-bg)', border: '1px solid var(--dv-border)', borderRadius: 4, fontSize: 11, color: '#fff' }}
                />
             </div>
          </div>

          <div style={{ display: 'flex', gap: 4, padding: '8px 10px', overflowX: 'auto', flexShrink: 0, borderBottom: '1px solid var(--dv-border-dark)' }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: '3px 10px', borderRadius: 12, border: '1px solid',
                borderColor: cat === c ? 'var(--dv-accent)' : 'var(--dv-border)',
                background: cat === c ? 'rgba(224,90,43,0.1)' : 'transparent',
                color: cat === c ? 'var(--dv-accent)' : 'var(--dv-text-muted)',
                fontSize: 9, cursor: 'pointer', whiteSpace: 'nowrap'
              }}>{c}</button>
            ))}
          </div>

          <div className="fx-list" style={{ flex: 1, overflowY: 'auto' }}>
            {Object.entries(groups).map(([category, items]) => (
              <div key={category}>
                <div className="fx-category" style={{ padding: '8px 12px', fontSize: 9, fontWeight: 700, color: '#555', textTransform: 'uppercase', background: 'rgba(0,0,0,0.2)' }}>{category}</div>
                {items.map(fx => (
                  <div
                    key={fx.id}
                    className="fx-item"
                    draggable
                    onDragStart={e => dragStartFX(e, fx)}
                    onDoubleClick={() => selectedClip && applyEffect(selectedClip.id, fx)}
                    style={{ padding: '6px 12px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 8, cursor: 'grab', borderBottom: '1px solid #1a1a1a' }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: fx.color || 'var(--dv-accent)' }} />
                    {fx.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'trans' && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
           <div className="fx-category" style={{ padding: '8px 12px', fontSize: 9, fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>Video Transitions</div>
           {VIDEO_TRANSITIONS.map(tr => (
             <div key={tr.id} className="fx-item" style={{ padding: '8px 12px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 8, cursor: 'grab', borderBottom: '1px solid #1a1a1a' }}>
               <div style={{ width: 14, height: 14, borderRadius: 2, border: '1px solid var(--dv-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: 'var(--dv-blue)' }}>T</div>
               {tr.name}
             </div>
           ))}
        </div>
      )}

      {tab === 'fusion' && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#444', gap: 10, padding: 20, textAlign: 'center' }}>
           <Sparkles size={32} opacity={0.3} />
           <div style={{ fontSize: 10 }}>Fusion Templates and VFX nodes appear here in the Fusion page.</div>
        </div>
      )}
    </div>
  );
}
