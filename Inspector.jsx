import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useEditor } from '../store/EditorContext';

function NumField({ label, value, min, max, step = 0.01, onChange }) {
  return (
    <div className="inspector-row">
      <span className="inspector-label">{label}</span>
      <div className="inspector-val" style={{ display: 'flex', gap: 4 }}>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: 'var(--dv-accent)' }}
        />
        <span className="num-field" style={{ width: 46, padding: '2px 4px', fontSize: 10 }}>
          {typeof value === 'number' ? value.toFixed(step < 1 ? 2 : 0) : value}
        </span>
      </div>
    </div>
  );
}

const TABS = ['Video', 'Audio', 'Effects', 'Color'];

export default function Inspector({ minimal = false }) {
  const { selectedClip, updateClip, removeClip, removeEffect } = useEditor();
  const [tab, setTab] = useState('Video');

  if (!selectedClip) {
    if (minimal) return null;
    return (
      <div className="inspector" style={minimal ? { width: '100%', border: 'none', minWidth: 0 } : {}}>
        {!minimal && (
          <div className="inspector-header">
            <span className="inspector-title">Inspector</span>
          </div>
        )}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--dv-text-muted)', padding: 16, textAlign: 'center', gap: 8 }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="4" y="8" width="32" height="24" rx="2" stroke="#444" strokeWidth="1.5"/>
            <line x1="4" y1="16" x2="36" y2="16" stroke="#333"/>
            <rect x="8" y="20" width="24" height="2" rx="1" fill="#333"/>
            <rect x="8" y="25" width="16" height="2" rx="1" fill="#333"/>
          </svg>
          <div style={{ fontSize: 11 }}>Select a clip to inspect</div>
        </div>
      </div>
    );
  }

  return (
    <div className="inspector" style={minimal ? { width: '100%', border: 'none', minWidth: 0 } : {}}>
      {!minimal && (
        <div className="inspector-header">
          <span className="inspector-title">Inspector</span>
          <span style={{ flex: 1, fontSize: 10, color: 'var(--dv-text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: 6 }}>
            {selectedClip.name}
          </span>
          <button className="btn-icon" onClick={() => removeClip(selectedClip.id)} title="Delete clip" style={{ color: '#e05a2b' }}>
            <Trash2 size={11} />
          </button>
        </div>
      )}

      {/* Clip badge */}
      <div style={{ padding: '5px 8px', borderBottom: '1px solid var(--dv-border-dark)', display: 'flex', gap: 5, alignItems: 'center' }}>
        <span style={{ fontSize: 9, fontWeight: 700, background: selectedClip.track.startsWith('V') ? 'var(--track-v)' : 'var(--track-a)', color: '#fff', padding: '1px 5px', borderRadius: 2 }}>
          {selectedClip.track}
        </span>
        {selectedClip.isAiGenerated && (
          <span style={{ fontSize: 9, fontWeight: 700, background: 'var(--ai-orange)', color: '#fff', padding: '1px 5px', borderRadius: 2 }}>AI</span>
        )}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--dv-text-muted)', marginLeft: 'auto' }}>
          {selectedClip.duration?.toFixed(2)}s
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--dv-border-dark)', flexShrink: 0 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '5px 2px', border: 'none', borderBottom: `2px solid ${tab === t ? 'var(--dv-accent)' : 'transparent'}`,
            background: 'transparent', color: tab === t ? 'var(--dv-text)' : 'var(--dv-text-muted)',
            fontSize: 9, fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.3px',
            transition: 'var(--trans)',
          }}>{t}</button>
        ))}
      </div>

      <div className="inspector-body">
        {tab === 'Video' && (
          <>
            <div className="inspector-section">
              <div className="inspector-section-title">Transform</div>
              <NumField label="Opacity"  value={selectedClip.opacity ?? 1}   min={0}    max={1}    onChange={v => updateClip(selectedClip.id, { opacity: v })} />
              <NumField label="Scale"    value={selectedClip.scale ?? 1}     min={0.05} max={5}    onChange={v => updateClip(selectedClip.id, { scale: v })} />
              <NumField label="Rotate"   value={selectedClip.rotate ?? 0}    min={-180} max={180}  step={0.5} onChange={v => updateClip(selectedClip.id, { rotate: v })} />
              <NumField label="X"        value={selectedClip.posX ?? 0}      min={-960} max={960}  step={1} onChange={v => updateClip(selectedClip.id, { posX: v })} />
              <NumField label="Y"        value={selectedClip.posY ?? 0}      min={-540} max={540}  step={1} onChange={v => updateClip(selectedClip.id, { posY: v })} />
            </div>
            <div className="inspector-section">
              <div className="inspector-section-title">Speed</div>
              <NumField label="Rate"     value={selectedClip.speed ?? 1}     min={0.1}  max={8}    step={0.05} onChange={v => updateClip(selectedClip.id, { speed: v })} />
            </div>
            <div className="inspector-section">
              <div className="inspector-section-title">Sizing</div>
              <NumField label="Zoom"     value={selectedClip.zoom ?? 1}      min={0.1}  max={4}    onChange={v => updateClip(selectedClip.id, { zoom: v })} />
              <NumField label="Pan"      value={selectedClip.panX ?? 0}      min={-1}   max={1}    onChange={v => updateClip(selectedClip.id, { panX: v })} />
              <NumField label="Tilt"     value={selectedClip.tiltY ?? 0}     min={-1}   max={1}    onChange={v => updateClip(selectedClip.id, { tiltY: v })} />
            </div>
          </>
        )}

        {tab === 'Audio' && (
          <div className="inspector-section">
            <div className="inspector-section-title">Audio</div>
            <NumField label="Volume"   value={selectedClip.volume ?? 1}   min={0}   max={2}   onChange={v => updateClip(selectedClip.id, { volume: v })} />
            <NumField label="Pan"      value={selectedClip.audioPan ?? 0} min={-1}  max={1}   onChange={v => updateClip(selectedClip.id, { audioPan: v })} />
            <NumField label="Pitch"    value={selectedClip.pitch ?? 0}    min={-12} max={12}  step={0.5} onChange={v => updateClip(selectedClip.id, { pitch: v })} />
            <NumField label="EQ Lo"    value={selectedClip.eqLo ?? 0}     min={-12} max={12}  step={0.5} onChange={v => updateClip(selectedClip.id, { eqLo: v })} />
            <NumField label="EQ Hi"    value={selectedClip.eqHi ?? 0}     min={-12} max={12}  step={0.5} onChange={v => updateClip(selectedClip.id, { eqHi: v })} />
          </div>
        )}

        {tab === 'Effects' && (
          <div className="inspector-section">
            <div className="inspector-section-title">Applied Effects</div>
            {selectedClip.effects?.length === 0 && (
              <div style={{ fontSize: 10, color: 'var(--dv-text-muted)', padding: '8px 0', textAlign: 'center' }}>
                No effects applied.<br />
                <span style={{ fontSize: 9 }}>Drag from FX panel or double-click an effect</span>
              </div>
            )}
            {selectedClip.effects?.map((ef, i) => (
              <div key={i} className="effect-chip">
                <span>{ef.name}</span>
                <button onClick={() => removeEffect(selectedClip.id, i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dv-text-muted)', display: 'flex', padding: 2 }}>
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'Color' && (
          <div className="inspector-section">
            <div className="inspector-section-title">Color Grading</div>
            <NumField label="Bright"     value={selectedClip.brightness ?? 100} min={0}    max={200}  step={1} onChange={v => updateClip(selectedClip.id, { brightness: v })} />
            <NumField label="Contrast"   value={selectedClip.contrast ?? 100}   min={0}    max={200}  step={1} onChange={v => updateClip(selectedClip.id, { contrast: v })} />
            <NumField label="Satur"      value={selectedClip.saturation ?? 100} min={0}    max={200}  step={1} onChange={v => updateClip(selectedClip.id, { saturation: v })} />
            <div style={{ margin: '8px 0', borderTop: '1px solid var(--dv-border-dark)' }} />
            <NumField label="Temp"       value={selectedClip.temperature ?? 0}  min={-100} max={100}  step={1} onChange={v => updateClip(selectedClip.id, { temperature: v })} />
            <NumField label="Tint"       value={selectedClip.tint ?? 0}         min={-100} max={100}  step={1} onChange={v => updateClip(selectedClip.id, { tint: v })} />
            <NumField label="Hue"        value={selectedClip.hue ?? 0}          min={-180} max={180}  step={1} onChange={v => updateClip(selectedClip.id, { hue: v })} />
            <div style={{ margin: '8px 0', borderTop: '1px solid var(--dv-border-dark)' }} />
            <NumField label="Sepia"      value={selectedClip.sepia ?? 0}        min={0}    max={100}  step={1} onChange={v => updateClip(selectedClip.id, { sepia: v })} />
            <NumField label="Blur"       value={selectedClip.blur ?? 0}         min={0}    max={20}   step={0.5} onChange={v => updateClip(selectedClip.id, { blur: v })} />
          </div>
        )}
      </div>

      {/* Keyframe button */}
      {!minimal && (
        <div style={{ padding: '6px 8px', borderTop: '1px solid var(--dv-border-dark)', flexShrink: 0 }}>
          <button className="btn" style={{ width: '100%', justifyContent: 'center', fontSize: 10 }}>
            ⬦ Add Keyframe
          </button>
        </div>
      )}
    </div>
  );
}
