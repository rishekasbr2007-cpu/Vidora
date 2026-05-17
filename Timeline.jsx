import { useRef, useState, useCallback } from 'react';
import { Film, Music, Eye, EyeOff, Lock, Unlock, Volume2, Plus } from 'lucide-react';
import { useEditor } from '../store/EditorContext';

const HEADER_W = 72;

function fmtTime(s) {
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2,'0')}`;
}

function Ruler({ pxPerSec, totalDuration, onSeek, scrollLeft }) {
  const total = Math.ceil(totalDuration) + 15;
  const step  = pxPerSec >= 120 ? 1 : pxPerSec >= 60 ? 2 : pxPerSec >= 30 ? 5 : 10;
  const ticks = [];
  for (let i = 0; i <= total; i += step) {
    const x     = i * pxPerSec;
    const major = i % (step * 5) === 0;
    ticks.push(
      <div key={i} className={`ruler-tick ${major ? 'major' : 'minor'}`}
        style={{ left: x }}>
        {major && <span>{fmtTime(i)}</span>}
      </div>
    );
  }
  return (
    <div className="ruler-row">
      <div className="ruler-labels" />
      <div
        className="ruler-area"
        style={{ width: total * pxPerSec, cursor:'pointer' }}
        onClick={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          onSeek(Math.max(0, (e.clientX - rect.left) / pxPerSec));
        }}
      >
        {ticks}
      </div>
    </div>
  );
}

function Clip({ clip, pxPerSec, selected, onSelect }) {
  const { removeClip, updateClip, bladeMode, splitClip } = useEditor();
  const left  = clip.startTime * pxPerSec;
  const width = Math.max(16, clip.duration * pxPerSec - 1);
  const isAI  = clip.isAiGenerated;
  const cls   = isAI ? 'clip-ai' : clip.type === 'audio' ? 'clip-a' : 'clip-v';

  const dragRef = useRef({ dragging: false, startX: 0, startTime: 0 });

  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    if (bladeMode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickPx = e.clientX - rect.left;
      const clickTime = clip.startTime + (clickPx / pxPerSec);
      splitClip(clip.id, clickTime);
      return;
    }
    onSelect(clip.id);
    dragRef.current = { dragging: true, startX: e.clientX, startTime: clip.startTime };
    const onMove = (mv) => {
      const dx = (mv.clientX - dragRef.current.startX) / pxPerSec;
      updateClip(clip.id, { startTime: Math.max(0, dragRef.current.startTime + dx) });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div
      className={`clip ${cls} ${selected ? 'selected' : ''}`}
      style={{ left, width }}
      onMouseDown={onMouseDown}
      onContextMenu={e => { e.preventDefault(); removeClip(clip.id); }}
      title={`${clip.name} — right-click to delete`}
    >
      <div className="clip-handle clip-handle-left"
        onMouseDown={e => {
          e.stopPropagation();
          const startX = e.clientX, origStart = clip.startTime, origDur = clip.duration;
          const move = mv => {
            const dx = (mv.clientX - startX) / pxPerSec;
            const newStart = Math.max(0, Math.min(origStart + dx, origStart + origDur - 0.5));
            const newDur   = origDur - (newStart - origStart);
            const newOffset = (clip.sourceOffset || 0) + (newStart - origStart);
            updateClip(clip.id, { startTime: newStart, duration: newDur, sourceOffset: newOffset });
          };
          const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
          window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
        }}
      />
      {clip.type === 'audio'
        ? <Music size={8} style={{ flexShrink:0, opacity:0.7 }} />
        : <Film  size={8} style={{ flexShrink:0, opacity:0.7 }} />
      }
      <span className="clip-label">{clip.name}</span>
      {isAI && <span className="clip-ai-badge">AI</span>}
      {clip.effects?.length > 0 && (
        <span className="clip-fx-badge">FX:{clip.effects.length}</span>
      )}
      {clip.type === 'audio' && (
        <svg className="clip-wave" preserveAspectRatio="none" viewBox="0 0 100 10">
          {Array.from({length:40}, (_,i) => (
            <rect key={i} x={i*2.5} y={5 - Math.random()*4} width="1.5" height={Math.random()*8} fill="rgba(255,255,255,0.4)" rx="0.5"/>
          ))}
        </svg>
      )}
      <div className="clip-handle clip-handle-right"
        onMouseDown={e => {
          e.stopPropagation();
          const startX = e.clientX, origDur = clip.duration;
          const move = mv => {
            const dx = (mv.clientX - startX) / pxPerSec;
            updateClip(clip.id, { duration: Math.max(0.5, origDur + dx) });
          };
          const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
          window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
        }}
      />
    </div>
  );
}

export default function Timeline() {
  const {
    clips, selectedClipId, setSelectedClipId,
    playheadTime, seek, pxPerSec, totalDuration,
    dropClipToTrack, moveClip, mediaPool, applyEffect,
    videoTracks, audioTracks, allTracks, bladeMode, splitClip, snapping, markers,
    addTrack, deleteTrack
  } = useEditor();

  const scrollRef  = useRef();
  const [dragOver, setDragOver]   = useState(null);
  const [locked,   setLocked]     = useState(new Set());
  const [hidden,   setHidden]     = useState(new Set());

  const totalW  = HEADER_W + (totalDuration + 15) * pxPerSec;
  const phLeft  = HEADER_W + playheadTime * pxPerSec;

  const handleDrop = useCallback((e, track) => {
    e.preventDefault(); setDragOver(null);
    if (locked.has(track)) return;
    const mediaId  = e.dataTransfer.getData('mediaId');
    const effectId = e.dataTransfer.getData('effectId');
    const effectName = e.dataTransfer.getData('effectName');
    const rect     = e.currentTarget.getBoundingClientRect();
    const dropPx   = e.clientX - rect.left + (scrollRef.current?.scrollLeft || 0);

    if (mediaId) {
      const item = mediaPool.find(m => m.id === mediaId);
      if (item) dropClipToTrack(item, track, dropPx);
    } else if (effectId && selectedClipId) {
      applyEffect(selectedClipId, { id: effectId, name: effectName });
    }
  }, [mediaPool, dropClipToTrack, selectedClipId, applyEffect, locked]);

  const handleLaneClick = (e, track) => {
    if (bladeMode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickTime = (e.clientX - rect.left + (scrollRef.current?.scrollLeft || 0)) / pxPerSec;
      const clipToSplit = clips.find(c => c.track === track && clickTime >= c.startTime && clickTime <= c.startTime + c.duration);
      if (clipToSplit) splitClip(clipToSplit.id, clickTime);
    } else {
      setSelectedClipId(null);
    }
  };

  const trackColor = (t) => {
    if (t.startsWith('V')) {
      const idx = parseInt(t.slice(1));
      return idx === 1 ? 'var(--track-v-light)' : idx === 2 ? 'var(--track-v)' : '#2a5080';
    }
    const idx = parseInt(t.slice(1));
    return idx === 1 ? 'var(--track-a-light)' : idx === 2 ? 'var(--track-a)' : '#1e5040';
  };

  return (
    <div className={`timeline-section ${bladeMode ? 'blade-active' : ''}`}>
      <div className="timeline-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="timeline-title">Timeline</span>
          <div style={{ display: 'flex', gap: 4 }}>
             <div className={`tool-indicator ${bladeMode ? 'active' : ''}`} title="Blade Mode (B)">✂</div>
             <div className={`tool-indicator ${snapping ? 'active' : ''}`} title="Snapping (S)">🧲</div>
          </div>
        </div>
        <span style={{ marginLeft:8, fontFamily:'var(--font-mono)', fontSize:9, color:'var(--dv-text-muted)' }}>
          {clips.length} clips · {Math.ceil(totalDuration)}s
        </span>
        <div style={{ marginLeft:'auto', display:'flex', gap:3 }}>
          <button className="btn-icon" onClick={() => addTrack('video')} title="Add Video Track"><Film size={11} /><Plus size={8} style={{marginLeft:-2}} /></button>
          <button className="btn-icon" onClick={() => addTrack('audio')} title="Add Audio Track"><Music size={11} /><Plus size={8} style={{marginLeft:-2}} /></button>
          <button className="btn-icon" title="Fit timeline">⊡</button>
          <button className="btn-icon" title="Timeline settings">⚙</button>
        </div>
      </div>

      <div className="timeline-scroll" ref={scrollRef}>
        <div className="timeline-inner" style={{ width: totalW, position:'relative' }}>
          <div style={{ height: 16, width: totalW - HEADER_W, marginLeft: HEADER_W, position: 'relative', borderBottom: '1px solid #111' }}>
             {markers.map(m => (
               <div key={m.id} style={{ position: 'absolute', left: m.time * pxPerSec, top: 4, width: 8, height: 8, background: m.color || '#4CAF50', transform: 'rotate(45deg)', cursor: 'pointer' }} title={m.name} />
             ))}
          </div>
          <Ruler pxPerSec={pxPerSec} totalDuration={totalDuration} onSeek={seek} />

          {allTracks.map(track => {
            const isVid     = videoTracks.includes(track);
            const trackClips= clips.filter(c => c.track === track);
            const isLocked  = locked.has(track);
            const isHidden  = hidden.has(track);

            return (
              <div key={track} className="track-row" style={{ opacity: isHidden ? 0.3 : 1 }}>
                <div 
                  className="track-header" 
                  style={{ width: HEADER_W }}
                  onContextMenu={e => { e.preventDefault(); if (confirm(`Delete track ${track}?`)) deleteTrack(track); }}
                >
                  <div style={{ width:6, height:24, borderRadius:2, background: trackColor(track), flexShrink:0, marginRight:3 }} />
                  <span className="track-label-text" style={{ color: trackColor(track), fontSize:10 }}>{track}</span>
                  <button className="track-btn" onClick={() => setHidden(s => { const n=new Set(s); n.has(track)?n.delete(track):n.add(track); return n; })}>
                    {isHidden ? <EyeOff size={9}/> : <Eye size={9}/>}
                  </button>
                  <button className="track-btn" onClick={() => setLocked(s => { const n=new Set(s); n.has(track)?n.delete(track):n.add(track); return n; })}>
                    {isLocked ? <Lock size={9}/> : <Unlock size={9}/>}
                  </button>
                </div>
                <div
                  className={`track-lane ${dragOver===track ? 'drag-over' : ''} ${bladeMode ? 'blade-lane' : ''}`}
                  style={{ width: totalW - HEADER_W }}
                  onDragOver={e => { e.preventDefault(); setDragOver(track); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={e => handleDrop(e, track)}
                  onClick={(e) => handleLaneClick(e, track)}
                >
                  {trackClips.map(clip => (
                    <Clip key={clip.id} clip={clip} pxPerSec={pxPerSec} selected={clip.id === selectedClipId} onSelect={setSelectedClipId} />
                  ))}
                </div>
              </div>
            );
          })}

          <div className="playhead-line" style={{ left: phLeft }}><div className="playhead-head" /></div>

          <div style={{ position: 'sticky', right: 0, top: 0, bottom: 0, width: 42, background: 'var(--dv-panel-dark)', borderLeft: '1px solid var(--dv-border)', display: 'flex', flexDirection: 'column', padding: '20px 0', gap: 4, zIndex: 10 }}>
             {audioTracks.map(t => (
               <div key={t} style={{ flex: 1, width: 6, background: '#000', margin: '0 auto', borderRadius: 1, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${20 + Math.random() * 60}%`, background: 'linear-gradient(to top, #4CAF50, #8BC34A, #FFEB3B, #F44336)' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.1)' }} />
               </div>
             ))}
             <div style={{ height: 12, borderTop: '1px solid #333', marginTop: 4, fontSize: 7, color: '#444', textAlign: 'center' }}>LR</div>
          </div>
        </div>
      </div>
    </div>
  );
}
