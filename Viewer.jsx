import { useState, useEffect } from 'react';
import { Film, Maximize, Settings, Info } from 'lucide-react';
import { useEditor } from '../store/EditorContext';

export default function Viewer({ mode = 'timeline', customSrc = null }) {
  const { 
    selectedClip, clips, playheadTime, isPlaying, videoRef, audioRef, sourceVideoRef, buildFilter, 
    viewerSrc, viewerFit, setViewerFit, sourceMediaSrc 
  } = useEditor();

  // Mode-based configuration
  const isSource = mode === 'source';
  const targetRef = isSource ? sourceVideoRef : videoRef;
  
  // Logic for what content to show
  let currentSrc = customSrc;
  let activeClipForFilter = null;
  let audioSrc = null;

  if (isSource) {
    currentSrc = customSrc || sourceMediaSrc;
  } else {
    // Timeline logic: show active clip at playhead
    const activeClip = clips.find(c => 
      c.track.startsWith('V') && 
      playheadTime >= c.startTime && 
      playheadTime <= c.startTime + c.duration
    );
    currentSrc = activeClip?.src || viewerSrc;
    activeClipForFilter = selectedClip || activeClip;
    const activeAudioClip = clips.find(c => 
      c.track.startsWith('A') && 
      playheadTime >= c.startTime && 
      playheadTime <= c.startTime + c.duration
    );
    audioSrc = activeAudioClip?.src || null;
  }

  const currentFilter = buildFilter(activeClipForFilter);

  const containerStyle = {
    flex: 1, 
    position: 'relative', 
    background: '#000', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    overflow: 'hidden',
    cursor: (isPlaying && !isSource) ? 'none' : 'default',
    aspectRatio: '16 / 9',
    width: '100%',
    maxHeight: '100%',
  };

  const videoStyle = {
    maxWidth: viewerFit === 'fit' ? '100%' : 'none',
    maxHeight: viewerFit === 'fit' ? '100%' : 'none',
    width: viewerFit === 'fill' ? '100%' : viewerFit === '100%' ? 'auto' : '100%',
    height: viewerFit === 'fill' ? '100%' : viewerFit === '100%' ? 'auto' : '100%',
    objectFit: viewerFit === 'fill' ? 'cover' : 'contain',
    filter: currentFilter,
    transform: activeClipForFilter ? `scale(${activeClipForFilter.scale || 1}) rotate(${activeClipForFilter.rotate || 0}deg) translate(${activeClipForFilter.posX || 0}px, ${activeClipForFilter.posY || 0}px)` : 'none',
    opacity: activeClipForFilter ? (activeClipForFilter.opacity ?? 1) : 1,
  };

  return (
    <div className="viewer-container" style={containerStyle}>
      {currentSrc ? (
        <video
          ref={targetRef}
          src={currentSrc}
          style={videoStyle}
          muted={isSource || audioSrc !== null}
          playsInline
        />
      ) : (
        <div style={{ color: '#222', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <Film size={48} opacity={0.1} />
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{isSource ? 'SOURCE' : 'OFFLINE'}</div>
        </div>
      )}

      {/* Hidden audio element for audio playback */}
      {!isSource && audioSrc && (
        <audio ref={audioRef} src={audioSrc} playsInline />
      )}

      {/* Viewer Overlays */}
      <div className="viewer-overlay-top">
        <div className="viewer-zoom-controls">
          <button className={`zoom-btn ${viewerFit === 'fit' ? 'active' : ''}`} onClick={() => setViewerFit('fit')}>Fit</button>
          <button className={`zoom-btn ${viewerFit === '100%' ? 'active' : ''}`} onClick={() => setViewerFit('100%')}>100%</button>
        </div>
        <div className="viewer-info">
           {isSource ? 'Source Media' : (activeClipForFilter?.name || 'Timeline')}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
           <button className="btn-icon-dim"><Settings size={12}/></button>
           <button className="btn-icon-dim"><Maximize size={12}/></button>
        </div>
      </div>

      {isPlaying && !isSource && (
        <div className="viewer-playing-indicator">
          <div className="dot" /> PLAY
        </div>
      )}

      {/* Mode Indicator */}
      <div style={{ position: 'absolute', bottom: 8, left: 8, fontSize: 8, color: '#444', fontWeight: 800, background: 'rgba(0,0,0,0.4)', padding: '2px 5px', borderRadius: 2 }}>
         {isSource ? 'SOURCE' : 'TIMELINE'}
      </div>
    </div>
  );
}
