import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const EditorContext = createContext(null);

export const VIDEO_TRANSITIONS = [
  { id:'cross-dissolve', name:'Cross Dissolve', cat:'Transitions' },
  { id:'dip-color',      name:'Dip to Color',   cat:'Transitions' },
  { id:'smooth-cut',     name:'Smooth Cut',     cat:'Transitions' },
  { id:'iris',           name:'Iris',           cat:'Transitions' },
  { id:'push',           name:'Push',           cat:'Transitions' },
  { id:'slide',          name:'Slide',          cat:'Transitions' },
  { id:'zoom',           name:'Zoom',           cat:'Transitions' },
  { id:'wipe',           name:'Wipe',           cat:'Transitions' },
  { id:'spin',           name:'Spin',           cat:'Transitions' },
  { id:'blur-dissolve',  name:'Blur Dissolve',  cat:'Transitions' },
];

export const AUDIO_TRANSITIONS = [
  { id:'cross-fade',     name:'Cross Fade',     cat:'Audio' },
  { id:'3db-fade',       name:'+3 dB Fade',      cat:'Audio' },
  { id:'minus-3db-fade', name:'-3 dB Fade',      cat:'Audio' },
];

export const OPENFX = [
  { id:'blur',           name:'Blur',            cat:'Blur',     color:'#5588cc' },
  { id:'glow',           name:'Glow',            cat:'Light',    color:'#ffaa00' },
  { id:'sharpen',        name:'Sharpen',         cat:'Blur',     color:'#5588cc' },
  { id:'lens-flare',     name:'Lens Flare',      cat:'Light',    color:'#ffaa00' },
  { id:'film-grain',     name:'Film Grain',      cat:'Stylize',  color:'#aa6633' },
  { id:'camera-shake',   name:'Camera Shake',    cat:'Distort',  color:'#33aacc' },
  { id:'beauty',         name:'Beauty',          cat:'Retouch',  color:'#cc44aa' },
  { id:'vignette',       name:'Vignette',        cat:'Stylize',  color:'#aa3355' },
  { id:'tilt-shift',     name:'Tilt Shift Blur', cat:'Blur',     color:'#5588cc' },
  { id:'edge-detect',    name:'Edge Detect',     cat:'Stylize',  color:'#aa3355' },
  { id:'mosaic-blur',    name:'Mosaic Blur',     cat:'Blur',     color:'#5588cc' },
  { id:'light-rays',     name:'Light Rays',      cat:'Light',    color:'#ffaa00' },
  { id:'watercolor',     name:'Watercolor',      cat:'Stylize',  color:'#aa3355' },
  { id:'sketch',         name:'Sketch',          cat:'Stylize',  color:'#aa3355' },
  { id:'noise-reduction',name:'Noise Reduction', cat:'Retouch',  color:'#cc44aa' },
  { id:'face-refine',    name:'Face Refinement', cat:'Retouch',  color:'#cc44aa' },
  { id:'dead-pixel',     name:'Dead Pixel Fixer',cat:'Utility',  color:'#666' },
];

export const FUSION_NODES = [
  { id:'bright-cont',    name:'BrightnessContrast', cat:'Color' },
  { id:'color-corr',     name:'ColorCorrector',     cat:'Color' },
  { id:'color-curves',   name:'ColorCurves',        cat:'Color' },
  { id:'hue-curves',     name:'HueCurves',          cat:'Color' },
  { id:'delta-keyer',    name:'Delta Keyer',        cat:'Keying' },
  { id:'chroma-keyer',   name:'Chroma Keyer',       cat:'Keying' },
  { id:'p-emitter',      name:'pEmitter',           cat:'Particles' },
  { id:'p-render',       name:'pRender',            cat:'Particles' },
  { id:'render-3d',      name:'Renderer3D',         cat:'3D' },
  { id:'camera-3d',      name:'Camera3D',           cat:'3D' },
  { id:'text-plus',      name:'Text+',              cat:'Text' },
  { id:'time-speed',     name:'TimeSpeed',          cat:'Time' },
];

export const GENERATORS = [
  { id:'solid-color',    name:'Solid Color',    cat:'Generators' },
  { id:'gradient',       name:'Gradient',       cat:'Generators' },
  { id:'background',     name:'Background',     cat:'Generators' },
];

export const TITLES = [
  { id:'fusion-title',   name:'Fusion Titles',  cat:'Titles' },
  { id:'lower-third',    name:'Lower Thirds',   cat:'Titles' },
  { id:'countdown',      name:'Countdown',      cat:'Titles' },
  { id:'scroll-text',    name:'Scroll Text',    cat:'Titles' },
  { id:'credit-roll',    name:'Credit Roll',    cat:'Titles' },
];

export const AI_EFFECTS = [
  { id:'magic-mask',     name:'Magic Mask',     cat:'AI' },
  { id:'smart-reframe',  name:'Smart Reframe',  cat:'AI' },
  { id:'voice-iso',      name:'Voice Isolation',cat:'AI' },
  { id:'diag-sep',       name:'Dialogue Separator', cat:'AI' },
  { id:'obj-removal',    name:'Object Removal', cat:'AI' },
  { id:'depth-map',      name:'Depth Map',      cat:'AI' },
];

export function EditorProvider({ children }) {
  const [mediaPool, setMediaPool] = useState([]);
  const [clips, setClips] = useState([]);
  const [history, setHistory] = useState({ past: [], future: [] });
  const [videoTracks, setVideoTracks] = useState(['V1', 'V2', 'V3']);
  const [audioTracks, setAudioTracks] = useState(['A1', 'A2', 'A3']);
  const [selectedClipId, setSelectedClipId] = useState(null);
  const [playheadTime, setPlayheadTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [snapping, setSnapping] = useState(true);
  const [bladeMode, setBladeMode] = useState(false);
  const [aiVideos, setAiVideos] = useState([]);
  const [viewerSrc, setViewerSrc] = useState(null);
  const [viewerFit, setViewerFit] = useState('contain'); 
  const [trackVolumes, setTrackVolumes] = useState({
    V1: 1, V2: 1, V3: 1, A1: 1, A2: 1, A3: 1
  });
  const [trackMutes, setTrackMutes] = useState({});
  const [sourceMediaSrc, setSourceMediaSrc] = useState(null);
  const [markers, setMarkers] = useState([]);

  const videoRef = useRef(null);
  const sourceVideoRef = useRef(null);
  const audioRef = useRef(null);
  const rafRef   = useRef(null);
  const startRef = useRef(0);
  const playingRef = useRef(false);
  const clipsRef = useRef(clips);
  
  useEffect(() => {
    clipsRef.current = clips;
  }, [clips]);

  const pxPerSec = 80 * zoom;
  const selectedClip = clips.find(c => c.id === selectedClipId) || null;
  const totalDuration = Math.max(30, ...clips.map(c => c.startTime + c.duration), 0);
  const allTracks = [...videoTracks, ...audioTracks];

  // ── HISTORY ────────────────────────────────────────────────────────────
  const pushHistory = useCallback((newClips) => {
    setHistory(prev => ({
      past: [...prev.past.slice(-49), clips],
      future: []
    }));
    setClips(newClips);
  }, [clips]);

  const undo = useCallback(() => {
    if (history.past.length === 0) return;
    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, history.past.length - 1);
    setHistory({
      past: newPast,
      future: [clips, ...history.future]
    });
    setClips(previous);
  }, [clips, history]);

  const redo = useCallback(() => {
    if (history.future.length === 0) return;
    const next = history.future[0];
    const newFuture = history.future.slice(1);
    setHistory({
      past: [...history.past, clips],
      future: newFuture
    });
    setClips(next);
  }, [clips, history]);

  // ── TRACKS ──────────────────────────────────────────────────────────────
  const addTrack = useCallback((type) => {
    if (type === 'video') {
      const nextId = `V${videoTracks.length + 1}`;
      setVideoTracks(prev => [...prev, nextId]);
    } else {
      const nextId = `A${audioTracks.length + 1}`;
      setAudioTracks(prev => [...prev, nextId]);
    }
  }, [videoTracks, audioTracks]);

  const deleteTrack = useCallback((trackId) => {
    if (trackId.startsWith('V')) {
      if (videoTracks.length <= 1) return;
      setVideoTracks(prev => prev.filter(t => t !== trackId));
    } else {
      if (audioTracks.length <= 1) return;
      setAudioTracks(prev => prev.filter(t => t !== trackId));
    }
    pushHistory(clips.filter(c => c.track !== trackId));
  }, [videoTracks, audioTracks, clips, pushHistory]);

  // ── MEDIA ──────────────────────────────────────────────────────────────
  const addMedia = useCallback((file) => {
    const src = URL.createObjectURL(file);
    const isVid = file.type.startsWith('video/');
    const isAud = file.type.startsWith('audio/');
    const item = {
      id: `m_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: file.name, src, type: isVid ? 'video' : isAud ? 'audio' : 'other',
      duration: 0, file,
    };
    if (isVid || isAud) {
      const el = document.createElement(isVid ? 'video' : 'audio');
      el.src = src;
      el.addEventListener('loadedmetadata', () => {
        setMediaPool(prev => prev.map(m => m.id === item.id ? { ...m, duration: el.duration } : m));
      }, { once: true });
    }
    setMediaPool(prev => [...prev, item]);
    return item;
  }, []);

  const addAiMedia = useCallback((videoData) => {
    setAiVideos(prev => [...prev, videoData]);
  }, []);

  const addMarker = useCallback(() => {
    const colors = ['#4CAF50', '#2196F3', '#FFEB3B', '#F44336', '#9C27B0'];
    const newMarker = {
      id: `m_${Date.now()}`,
      time: playheadTime,
      name: `Marker ${markers.length + 1}`,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setMarkers(prev => [...prev, newMarker]);
  }, [playheadTime, markers.length]);

  // ── CLIPS ──────────────────────────────────────────────────────────────
  const dropClipToTrack = useCallback((mediaItem, track, dropPx) => {
    let startTime = Math.max(0, (dropPx - 72) / pxPerSec);
    const duration = mediaItem.duration || 10;
    const isVidTrack = track.startsWith('V');
    
    const baseProps = {
      mediaId: mediaItem.id,
      name: mediaItem.name, src: mediaItem.src,
      startTime, duration, sourceOffset: 0,
      volume: 1, opacity: 1, speed: 1, scale: 1, rotate: 0, posX: 0, posY: 0,
      brightness: 100, contrast: 100, saturation: 100, hue: 0, sepia: 0, blur: 0,
      temperature: 0, tint: 0, exposure: 0, highlights: 0, shadows: 0,
      lift: { x: 0, y: 0 }, gamma: { x: 0, y: 0 }, gain: { x: 0, y: 0 }, offset: { x: 0, y: 0 },
      hdrDark: { x: 0, y: 0 }, hdrShadow: { x: 0, y: 0 }, hdrLight: { x: 0, y: 0 }, hdrGlobal: { x: 0, y: 0 },
      hdrDarkExp: 0, hdrDarkSat: 1, hdrShadowExp: 0, hdrShadowSat: 1, hdrLightExp: 0, hdrLightSat: 1, hdrGlobalExp: 0, hdrGlobalSat: 1,
      effects: [], transitions: [],
    };

    const newClips = [];
    const groupId = `g_${Date.now()}`;
    
    if (mediaItem.type === 'video' && isVidTrack) {
      newClips.push({ ...baseProps, id: `c_${Date.now()}_v`, type: 'video', track, groupId });
      newClips.push({ ...baseProps, id: `c_${Date.now()}_a`, type: 'audio', track: 'A1', groupId });
    } else {
      newClips.push({ ...baseProps, id: `c_${Date.now()}`, type: isVidTrack ? 'video' : 'audio', track });
    }
    
    pushHistory([...clips, ...newClips]);
    setSelectedClipId(newClips[0].id);
  }, [pxPerSec, clips, pushHistory]);

  const splitClip = useCallback((id, time) => {
    setClips(prev => {
      const targetClip = prev.find(c => c.id === id);
      if (!targetClip) return prev;

      const clipsToSplit = targetClip.groupId ? prev.filter(c => c.groupId === targetClip.groupId) : [targetClip];
      let updatedPrev = [...prev];
      const newClips = [];
      const newGroupId = targetClip.groupId ? `g_${Math.random().toString(36).substr(2, 9)}` : null;

      for (const clip of clipsToSplit) {
        const splitPoint = time - clip.startTime;
        if (splitPoint <= 0 || splitPoint >= clip.duration) continue;

        const newId = `c_${Math.random().toString(36).substr(2, 9)}`;
        const newClip = { 
          ...clip, 
          id: newId, 
          startTime: time, 
          duration: clip.duration - splitPoint,
          sourceOffset: (clip.sourceOffset || 0) + splitPoint
        };
        if (newGroupId) newClip.groupId = newGroupId;
        
        const updatedOldClip = { ...clip, duration: splitPoint };

        updatedPrev = updatedPrev.map(c => c.id === clip.id ? updatedOldClip : c);
        newClips.push(newClip);
      }

      return updatedPrev.concat(newClips);
    });
  }, []);

  const moveClip = useCallback((id, track, dropPx) => {
    let startTime = Math.max(0, (dropPx - 72) / pxPerSec);
    setClips(prev => {
      const targetClip = prev.find(c => c.id === id);
      if (!targetClip) return prev;
      
      const dt = startTime - targetClip.startTime;
      if (targetClip.groupId) {
        return prev.map(c => c.groupId === targetClip.groupId 
          ? { ...c, startTime: Math.max(0, c.startTime + dt), track: c.id === id ? track : c.track } 
          : c
        );
      } else {
        return prev.map(c => c.id === id ? { ...c, track, startTime } : c);
      }
    });
  }, [pxPerSec]);

  const removeClip = useCallback((id) => {
    pushHistory(clips.filter(c => c.id !== id));
    setSelectedClipId(null);
  }, [clips, pushHistory]);

  const updateClip = useCallback((id, data) => {
    setClips(prev => {
      const targetClip = prev.find(c => c.id === id);
      if (!targetClip) return prev;

      if (targetClip.groupId && (data.startTime !== undefined || data.duration !== undefined)) {
        const timingData = {};
        if (data.startTime !== undefined) timingData.startTime = data.startTime;
        if (data.duration !== undefined) timingData.duration = data.duration;
        if (data.sourceOffset !== undefined) timingData.sourceOffset = data.sourceOffset;
        
        return prev.map(c => {
          if (c.groupId === targetClip.groupId) {
             return c.id === id ? { ...c, ...data } : { ...c, ...timingData };
          }
          return c;
        });
      }
      return prev.map(c => c.id === id ? { ...c, ...data } : c);
    });
  }, []);

  const applyEffect = useCallback((clipId, effect) => {
    setClips(prev => prev.map(c =>
      c.id === clipId ? { ...c, effects: [...c.effects, { ...effect }] } : c
    ));
  }, []);

  const removeEffect = useCallback((clipId, idx) => {
    setClips(prev => prev.map(c =>
      c.id === clipId ? { ...c, effects: c.effects.filter((_, i) => i !== idx) } : c
    ));
  }, []);

  // ── PLAYBACK ───────────────────────────────────────────────────────────
  const _syncMediaToTime = useCallback((t) => {
    const v = videoRef.current;
    const a = audioRef.current;
    if (v) {
      const activeVideo = clips.find(c => c.type === 'video' && t >= c.startTime && t <= c.startTime + c.duration);
      if (activeVideo) {
        const expected = (t - activeVideo.startTime) + (activeVideo.sourceOffset || 0);
        if (v.readyState >= 1 && Math.abs(v.currentTime - expected) > 0.1) v.currentTime = expected;
      }
    }
    if (a) {
      const activeAudio = clips.find(c => c.type === 'audio' && t >= c.startTime && t <= c.startTime + c.duration);
      if (activeAudio) {
        const expected = (t - activeAudio.startTime) + (activeAudio.sourceOffset || 0);
        if (a.readyState >= 1 && Math.abs(a.currentTime - expected) > 0.1) a.currentTime = expected;
      }
    }
  }, [clips]);

  const play = useCallback(() => {
    if (playheadTime >= totalDuration) seek(0);
    startRef.current = performance.now() - (playheadTime / playbackSpeed) * 1000;
    setIsPlaying(true);
    playingRef.current = true;
    if (videoRef.current) { videoRef.current.playbackRate = playbackSpeed; videoRef.current.play().catch(()=>{}); }
    if (audioRef.current) { audioRef.current.playbackRate = playbackSpeed; audioRef.current.play().catch(()=>{}); }
    
    const tick = () => {
      if (!playingRef.current) return;
      const elapsed = (performance.now() - startRef.current) / 1000;
      const t = elapsed * playbackSpeed;
      setPlayheadTime(t);
      if (t >= totalDuration) {
        pause();
        return;
      }

      const v = videoRef.current;
      if (v) {
         const activeVideo = clipsRef.current.find(c => c.type === 'video' && t >= c.startTime && t <= c.startTime + c.duration);
         if (activeVideo) {
            const expected = (t - activeVideo.startTime) + (activeVideo.sourceOffset || 0);
            if (v.readyState >= 1) {
              if (Math.abs(v.currentTime - expected) > 0.25) v.currentTime = expected;
              if (v.paused) v.play().catch(()=>{});
            }
         }
      }
      const a = audioRef.current;
      if (a) {
         const activeAudio = clipsRef.current.find(c => c.type === 'audio' && t >= c.startTime && t <= c.startTime + c.duration);
         if (activeAudio) {
            const expected = (t - activeAudio.startTime) + (activeAudio.sourceOffset || 0);
            if (a.readyState >= 1) {
              if (Math.abs(a.currentTime - expected) > 0.25) a.currentTime = expected;
              if (a.paused) a.play().catch(()=>{});
            }
         }
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playheadTime, playbackSpeed, totalDuration]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    playingRef.current = false;
    cancelAnimationFrame(rafRef.current);
    videoRef.current?.pause();
    audioRef.current?.pause();
  }, []);

  const seek = useCallback((t) => {
    const clamped = Math.max(0, Math.min(t, totalDuration));
    setPlayheadTime(clamped);
    startRef.current = performance.now() - (clamped / playbackSpeed) * 1000;
    _syncMediaToTime(clamped);
  }, [totalDuration, _syncMediaToTime, playbackSpeed]);

  const rewind = useCallback(() => { 
    pause(); 
    setPlayheadTime(0);
    if (videoRef.current) videoRef.current.currentTime = 0;
    if (audioRef.current) audioRef.current.currentTime = 0;
  }, [pause]);

  const stepForward  = useCallback(() => seek(playheadTime + 1/24), [seek, playheadTime]);
  const stepBackward = useCallback(() => seek(playheadTime - 1/24), [seek, playheadTime]);

  // ── KEYBOARD SHORTCUTS ──────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.ctrlKey && e.code === 'KeyZ' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey && e.shiftKey && e.code === 'KeyZ') || (e.ctrlKey && e.code === 'KeyY')) {
        e.preventDefault();
        redo();
      }
      if ((e.code === 'Delete' || e.code === 'Backspace') && selectedClipId) {
        removeClip(selectedClipId);
      }
      if (e.code === 'Space') { e.preventDefault(); isPlaying ? pause() : play(); }
      if (e.code === 'ArrowRight') stepForward();
      if (e.code === 'ArrowLeft') stepBackward();
      if (e.code === 'KeyB') setBladeMode(true);
      if (e.code === 'KeyA') setBladeMode(false);
      if (e.code === 'KeyS') setSnapping(prev => !prev);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, selectedClipId, removeClip, isPlaying, play, pause, stepForward, stepBackward]);

  useEffect(() => {
    if (isPlaying && playheadTime >= totalDuration) pause();
  }, [playheadTime, totalDuration, isPlaying, pause]);

  const buildFilter = useCallback((clip) => {
    if (!clip) return '';
    let filter = '';
    
    let b = clip.brightness !== undefined ? clip.brightness : 100;
    let c = clip.contrast !== undefined ? clip.contrast : 100;
    let s = clip.saturation !== undefined ? clip.saturation : 100;
    let h = clip.hue !== undefined ? clip.hue : 0;
    let sep = clip.sepia !== undefined ? clip.sepia : 0;
    
    if (clip.hdrGlobalExp !== undefined) b += clip.hdrGlobalExp * 50;
    if (clip.hdrGlobalSat !== undefined) s *= clip.hdrGlobalSat;
    if (clip.hdrGlobal && (clip.hdrGlobal.x !== 0 || clip.hdrGlobal.y !== 0)) {
      const dist = Math.min(1, Math.sqrt(clip.hdrGlobal.x ** 2 + clip.hdrGlobal.y ** 2));
      const angle = Math.atan2(clip.hdrGlobal.y, clip.hdrGlobal.x) * 180 / Math.PI;
      sep += dist * 50;
      h += angle;
    }
    
    if (b !== 100) filter += `brightness(${b}%) `;
    if (c !== 100) filter += `contrast(${c}%) `;
    if (s !== 100) filter += `saturate(${s}%) `;
    if (h !== 0)   filter += `hue-rotate(${h}deg) `;
    if (sep !== 0) filter += `sepia(${sep}%) `;
    if (clip.blur !== 0 && clip.blur !== undefined) filter += `blur(${clip.blur}px) `;
    
    if (clip.effects?.length) {
      clip.effects.forEach(ef => {
        switch (ef.id) {
          case 'blur':       filter += 'blur(8px) '; break;
          case 'sharpen':    filter += 'contrast(1.4) brightness(1.1) '; break;
          case 'glow':       filter += 'brightness(1.5) blur(1px) '; break;
          case 'vignette':   filter += 'brightness(0.8) contrast(1.2) '; break;
          case 'filmgrain':  filter += 'contrast(1.1) brightness(0.95) '; break;
          case 'grayscale':  filter += 'grayscale(1) '; break;
          case 'bright-cont':filter += 'brightness(1.2) contrast(1.2) '; break;
          case 'color-corr': filter += 'saturate(1.3) hue-rotate(15deg) '; break;
          case 'lens-flare': filter += 'brightness(1.3) contrast(1.1) saturate(1.2) '; break;
          case 'tilt-shift': filter += 'blur(3px) contrast(1.1) '; break;
          case 'watercolor': filter += 'saturate(1.5) blur(1px) contrast(0.9) '; break;
          case 'sketch':     filter += 'grayscale(1) contrast(2) brightness(1.5) '; break;
          default:           break;
        }
      });
    }
    return filter.trim() || 'none';
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    const a = audioRef.current;
    if (v) v.volume = trackMutes.V1 ? 0 : (trackVolumes.V1 !== undefined ? trackVolumes.V1 : 1);
    if (a) a.volume = trackMutes.A1 ? 0 : (trackVolumes.A1 !== undefined ? trackVolumes.A1 : 1);
  }, [trackVolumes]);

  return (
    <EditorContext.Provider value={{
      mediaPool, clips, selectedClip, selectedClipId,
      playheadTime, isPlaying, zoom, pxPerSec,
      playbackSpeed, setPlaybackSpeed,
      snapping, setSnapping,
      bladeMode, setBladeMode,
      aiVideos, viewerSrc, totalDuration,
      videoRef, sourceVideoRef, audioRef,
      videoTracks, audioTracks, allTracks,
      VIDEO_TRANSITIONS, AUDIO_TRANSITIONS, OPENFX, FUSION_NODES, GENERATORS, TITLES, AI_EFFECTS,
      addMedia, addAiMedia, dropClipToTrack, moveClip, splitClip,
      removeClip, updateClip, applyEffect, removeEffect,
      play, pause, seek, rewind, stepForward, stepBackward,
      setSelectedClipId, setZoom, setViewerFit, buildFilter,
      viewerFit, trackVolumes, setTrackVolumes, trackMutes, setTrackMutes,
      sourceMediaSrc, setSourceMediaSrc, markers, setMarkers,
      undo, redo, addTrack, deleteTrack, addMarker,
      VIDEO_TRACKS: videoTracks,
      AUDIO_TRACKS: audioTracks,
      ALL_TRACKS: allTracks,
    }}>
      {children}
    </EditorContext.Provider>
  );
}

export const useEditor = () => useContext(EditorContext);
