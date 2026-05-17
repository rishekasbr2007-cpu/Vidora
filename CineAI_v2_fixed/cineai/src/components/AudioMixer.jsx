import { useEditor } from '../store/EditorContext';
import { Volume2, VolumeX, Mic } from 'lucide-react';

export default function AudioMixer() {
  const { trackVolumes, setTrackVolumes, trackMutes, setTrackMutes, allTracks, audioTracks } = useEditor();

  const toggleMute = (track) => {
    setTrackMutes(prev => ({ ...prev, [track]: !prev[track] }));
  };

  const handleVolChange = (track, val) => {
    setTrackVolumes(prev => ({ ...prev, [track]: parseFloat(val) }));
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--dv-panel-dark)', borderLeft: '1px solid var(--dv-border-dark)', minWidth: 320 }}>
      <div style={{ height: 28, background: 'var(--dv-panel)', borderBottom: '1px solid var(--dv-border-dark)', display: 'flex', alignItems: 'center', padding: '0 10px', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--dv-text-muted)', textTransform: 'uppercase' }}>Mixer</span>
        <div style={{ fontSize: 9, color: '#444' }}>Mix: Main Bus</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 6px', display: 'flex', gap: 4 }}>
        {allTracks.map(track => {
          const isAudio = track.startsWith('A');
          const vol = trackVolumes[track] || 1;
          
          return (
            <div key={track} style={{ width: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#111', borderRadius: 2, padding: '8px 0', border: isAudio ? '1px solid #222' : 'none' }}>
              {/* Meters */}
              <div style={{ flex: 1, display: 'flex', gap: 2, marginBottom: 8 }}>
                <div style={{ width: 4, background: '#000', borderRadius: 1, position: 'relative' }}>
                   <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${vol * (40 + Math.random() * 40)}%`, background: 'linear-gradient(to top, #4CAF50, #8BC34A, #FFEB3B, #F44336)', borderRadius: 1 }} />
                </div>
                <div style={{ width: 4, background: '#000', borderRadius: 1, position: 'relative' }}>
                   <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${vol * (38 + Math.random() * 42)}%`, background: 'linear-gradient(to top, #4CAF50, #8BC34A, #FFEB3B, #F44336)', borderRadius: 1 }} />
                </div>
              </div>

              {/* Fader */}
              <div style={{ height: 100, width: '100%', display: 'flex', justifyContent: 'center', position: 'relative', margin: '10px 0' }}>
                 <input 
                   type="range" min="0" max="2" step="0.01" value={vol} 
                   onChange={e => handleVolChange(track, e.target.value)}
                   style={{ 
                     appearance: 'none', width: 80, height: 4, background: '#222', borderRadius: 2,
                     transform: 'rotate(-90deg)', position: 'absolute', top: 48, cursor: 'pointer'
                   }} 
                 />
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                 <button 
                   className={`btn-icon-dim ${trackMutes?.[track] ? 'active' : ''}`} 
                   style={{ width: 18, height: 18, fontSize: 8, background: trackMutes?.[track] ? '#f44336' : '', color: trackMutes?.[track] ? '#fff' : '' }}
                   onClick={() => toggleMute(track)}
                 >M</button>
                 <button className="btn-icon-dim" style={{ width: 18, height: 18, fontSize: 8 }}>S</button>
              </div>

              <div style={{ fontSize: 9, fontWeight: 800, color: isAudio ? 'var(--track-a-light)' : 'var(--track-v-light)' }}>{track}</div>
            </div>
          );
        })}

        {/* Master Output Section */}
        <div style={{ width: 100, display: 'flex', flexDirection: 'column', background: '#0a0a0f', border: '2px solid #1a1a24', borderRadius: 4, padding: '10px 6px', marginLeft: 6 }}>
           <div style={{ fontSize: 10, fontWeight: 900, color: '#fff', textAlign: 'center', marginBottom: 12, letterSpacing: 1 }}>MASTER</div>
           <div style={{ flex: 1, display: 'flex', gap: 6, justifyContent: 'center' }}>
              <div style={{ width: 8, background: '#000', borderRadius: 1, position: 'relative' }}>
                 <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '75%', background: 'linear-gradient(to top, #4CAF50, #8BC34A, #FFEB3B, #F44336)' }} />
              </div>
              <div style={{ width: 8, background: '#000', borderRadius: 1, position: 'relative' }}>
                 <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '72%', background: 'linear-gradient(to top, #4CAF50, #8BC34A, #FFEB3B, #F44336)' }} />
              </div>
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: 15 }}>
              <div style={{ fontSize: 11, color: 'var(--dv-accent)', fontWeight: 800 }}>-14.2 LUFS</div>
              <div style={{ fontSize: 8, color: '#444' }}>Target: -14</div>
           </div>
           <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
              <Volume2 size={14} color="#666" />
           </div>
        </div>
      </div>
    </div>
  );
}
