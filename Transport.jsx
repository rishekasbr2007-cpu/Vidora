import { useEditor } from '../store/EditorContext';
import {
  SkipBack, SkipForward, Play, Pause, Square,
  Volume2, VolumeX, ZoomIn, ZoomOut, Scissors, Repeat
} from 'lucide-react';
import { useState } from 'react';

function tc(s) {
  if (!s || s < 0) s = 0;
  const h  = Math.floor(s / 3600);
  const m  = Math.floor((s % 3600) / 60);
  const sec= Math.floor(s % 60);
  const fr = Math.floor((s % 1) * 24);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}:${String(fr).padStart(2,'0')}`;
}

export default function Transport() {
  const { isPlaying, play, pause, rewind, seek, playheadTime, totalDuration,
          zoom, setZoom, stepForward, stepBackward,
          playbackSpeed, setPlaybackSpeed } = useEditor();
  const [muted, setMuted]   = useState(false);
  const [loop,  setLoop]    = useState(false);

  return (
    <div className="transport">
      {/* Zoom controls */}
      <button className="transport-btn" onClick={() => setZoom(Math.max(0.25, zoom - 0.25))} title="Zoom Out (–)">
        <ZoomOut size={12} />
      </button>
      <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--dv-text-muted)', minWidth:28, textAlign:'center' }}>
        {zoom.toFixed(1)}x
      </span>
      <button className="transport-btn" onClick={() => setZoom(Math.min(8, zoom + 0.25))} title="Zoom In (+)">
        <ZoomIn size={12} />
      </button>

      <div className="transport-sep" />

      {/* Playback Speed */}
      <select 
        value={playbackSpeed} 
        onChange={e => setPlaybackSpeed(parseFloat(e.target.value))}
        className="transport-speed-select"
        title="Playback Speed"
      >
        <option value="0.25">0.25x</option>
        <option value="0.5">0.5x</option>
        <option value="1">1.0x</option>
        <option value="1.5">1.5x</option>
        <option value="2">2.0x</option>
        <option value="4">4.0x</option>
      </select>

      <div className="transport-sep" />

      {/* Tool buttons */}
      <button className="transport-btn" title="Razor / Blade (B)"><Scissors size={12} /></button>
      <button className={`transport-btn ${loop ? 'play' : ''}`} onClick={() => setLoop(v=>!v)} title="Loop"><Repeat size={12} /></button>

      <div className="transport-sep" />

      {/* Playback controls */}
      <button className="transport-btn" onClick={rewind} title="Go to Start (Home)">
        <SkipBack size={13} />
      </button>
      <button className="transport-btn" onClick={stepBackward} title="Step Back (←)">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
          <polygon points="6,2 1,6.5 6,11"/><rect x="7" y="2" width="2" height="9"/>
        </svg>
      </button>

      {/* Play/Pause individual buttons */}
      <div style={{ display: 'flex', gap: 2, background: 'var(--dv-panel-dark)', borderRadius: 4, padding: 2, border: '1px solid var(--dv-border-dark)' }}>
        <button
          className={`transport-btn ${!isPlaying ? 'active' : ''}`}
          onClick={pause}
          title="Pause (Space)"
          style={{ width: 32, height: 26, background: !isPlaying ? 'var(--dv-panel-light)' : 'transparent' }}
        >
          <Pause size={14} color={!isPlaying ? 'var(--dv-text-bright)' : 'var(--dv-text-muted)'} />
        </button>
        <button
          className={`transport-btn ${isPlaying ? 'active' : ''}`}
          onClick={play}
          title="Play (Space)"
          style={{ width: 32, height: 26, background: isPlaying ? 'var(--dv-panel-light)' : 'transparent' }}
        >
          <Play size={14} color={isPlaying ? 'var(--dv-accent)' : 'var(--dv-text-muted)'} />
        </button>
      </div>

      <button className="transport-btn" onClick={stepForward} title="Step Forward (→)">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
          <polygon points="7,2 12,6.5 7,11"/><rect x="4" y="2" width="2" height="9"/>
        </svg>
      </button>
      <button className="transport-btn" onClick={() => seek(totalDuration)} title="Go to End (End)">
        <SkipForward size={13} />
      </button>

      <div className="transport-sep" />

      {/* Timecode display */}
      <div className="transport-tc">{tc(playheadTime)}</div>
      <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--dv-text-muted)' }}>
        / {tc(totalDuration)}
      </span>

      <div className="transport-sep" />

      {/* Scrubber */}
      <input
        type="range" min={0} max={totalDuration} step={0.016} value={playheadTime}
        onChange={e => seek(parseFloat(e.target.value))}
        style={{ width: 180, accentColor:'var(--dv-accent)' }}
        title="Playhead position"
      />

      <div className="transport-sep" />

      {/* Volume */}
      <button className="transport-btn" onClick={() => setMuted(v=>!v)} title="Mute">
        {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
      </button>
    </div>
  );
}
