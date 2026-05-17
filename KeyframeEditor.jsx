import { useEditor } from '../store/EditorContext';
import { ChevronDown, Play, SkipBack, SkipForward, Circle } from 'lucide-react';

export default function KeyframeEditor() {
  const { playheadTime, seek, totalDuration } = useEditor();

  const pxPerSec = 50;
  const width = Math.max(1200, totalDuration * pxPerSec);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--dv-panel-dark)', borderLeft: '1px solid var(--dv-border-dark)' }}>
      <div style={{ height: 28, background: 'var(--dv-panel)', borderBottom: '1px solid var(--dv-border-dark)', display: 'flex', alignItems: 'center', padding: '0 10px', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--dv-text-muted)', textTransform: 'uppercase' }}>Keyframes</span>
        <div style={{ display: 'flex', gap: 6 }}>
           <button className="btn-icon-dim"><Circle size={8} fill="var(--dv-accent)" color="var(--dv-accent)" /></button>
           <button className="btn-icon-dim" onClick={() => seek(playheadTime - 1/24)}><SkipBack size={10} /></button>
           <button className="btn-icon-dim" onClick={() => seek(playheadTime + 1/24)}><SkipForward size={10} /></button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', position: 'relative', background: '#0a0a0f' }}>
        {/* Timeline ruler for keyframes */}
        <div style={{ width, height: 20, background: '#111', borderBottom: '1px solid #222', position: 'relative' }}>
          {Array.from({ length: Math.ceil(totalDuration) }).map((_, i) => (
            <div key={i} style={{ position: 'absolute', left: i * pxPerSec, bottom: 0, height: 5, width: 1, background: '#333' }}>
              <span style={{ position: 'absolute', bottom: 6, left: 2, fontSize: 8, color: '#444' }}>{i}s</span>
            </div>
          ))}
        </div>

        {/* Tracks in keyframe editor */}
        <div style={{ width, height: 'calc(100% - 20px)', position: 'relative' }}>
           {[ 'Corrector 1', 'Sizing', 'Camera Raw' ].map((track, i) => (
             <div key={track} style={{ height: 32, borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 10, color: '#666' }}>
                {track}
             </div>
           ))}

           {/* Playhead in keyframe editor */}
           <div style={{ 
             position: 'absolute', top: 0, bottom: 0, 
             left: playheadTime * pxPerSec, width: 1, background: 'var(--dv-accent)', 
             zIndex: 5, pointerEvents: 'none' 
           }}>
             <div style={{ width: 9, height: 9, background: 'var(--dv-accent)', borderRadius: '50%', transform: 'translate(-50%, 0)' }} />
           </div>
        </div>
      </div>

      {/* Zoom controls */}
      <div style={{ height: 24, borderTop: '1px solid var(--dv-border-dark)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 10px' }}>
         <input type="range" style={{ width: 80, height: 2, accentColor: '#444' }} />
      </div>
    </div>
  );
}
