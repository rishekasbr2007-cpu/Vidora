import { useState, useRef } from 'react';
import { Sparkles, Wand2, X, Plus, Download } from 'lucide-react';
import { useEditor } from '../store/EditorContext';

const STYLES = ['Cinematic', 'Anime', 'Realistic', '3D Render', 'Noir', 'Retro 8mm', 'Neon Cyber', 'Documentary'];
const DURATIONS = [3, 5, 8, 10, 15, 20];
const RESOLUTIONS = ['720p', '1080p', '4K'];
const ASPECT = ['16:9', '9:16', '1:1', '4:3', '2.39:1'];

const SAMPLE_PROMPTS = [
  'A lone astronaut walking on Mars at golden hour, cinematic lens flare',
  'Abstract neon fluid simulation, electric blue and violet, 4K',
  'Dense rainforest time-lapse from dawn to dusk, macro lens',
  'Cyberpunk city at night, flying cars, neon rain reflections',
  'Ocean waves crashing on rocks, slow motion, golden light',
  'Space nebula formation, galaxy swirling, cosmic scale',
];

let genCounter = 0;

export default function AIPanel({ onClose }) {
  const { addAiMedia } = useEditor();

  const [prompt, setPrompt]       = useState('');
  const [style, setStyle]         = useState('Cinematic');
  const [duration, setDuration]   = useState(5);
  const [resolution, setResolution] = useState('1080p');
  const [aspect, setAspect]       = useState('16:9');
  const [negPrompt, setNegPrompt] = useState('');
  const [credits, setCredits]     = useState(10);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [results, setResults]     = useState([]);
  const [error, setError]         = useState('');
  const [showNeg, setShowNeg]     = useState(false);

  const intervalRef = useRef(null);

  const generate = async () => {
    if (!prompt.trim()) { setError('Enter a prompt first'); return; }
    if (credits < 1)    { setError('No AI credits remaining. Upgrade your plan.'); return; }

    setError('');
    setGenerating(true);
    setProgress(0);
    setStatusMsg('Initializing AI engine…');

    const steps = [
      [15, 'Parsing prompt semantics…'],
      [30, 'Generating keyframes…'],
      [50, 'Synthesizing motion…'],
      [68, 'Applying style transfer…'],
      [80, 'Rendering frames…'],
      [90, 'Encoding video…'],
      [97, 'Finalizing output…'],
    ];
    let stepIdx = 0;

    intervalRef.current = setInterval(() => {
      if (stepIdx < steps.length) {
        const [p, msg] = steps[stepIdx++];
        setProgress(p);
        setStatusMsg(msg);
      }
    }, (duration * 150));

    await new Promise(r => setTimeout(r, duration * 900 + 2000));

    clearInterval(intervalRef.current);
    setProgress(100);
    setStatusMsg('Complete!');

    const newVid = {
      id: `ai_${Date.now()}_${++genCounter}`,
      name: `AI_${style.replace(/\s/g,'_')}_${genCounter}.mp4`,
      prompt,
      style,
      duration,
      resolution,
      aspect,
      src: null, // would be real URL from API in production
      createdAt: new Date().toISOString(),
      isAiGenerated: true,
      type: 'video',
    };

    setResults(prev => [newVid, ...prev]);
    addAiMedia(newVid);
    setCredits(c => c - 1);

    setTimeout(() => {
      setGenerating(false);
      setProgress(0);
      setStatusMsg('');
    }, 800);
  };

  return (
    <div style={{
      position: 'absolute', bottom: 270, left: 8, width: 310,
      background: 'var(--dv-panel)', border: '1px solid var(--dv-border)',
      borderRadius: 6, boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      zIndex: 200, maxHeight: 'calc(100vh - 350px)',
    }}>
      {/* Header */}
      <div style={{
        padding: '8px 12px', background: 'linear-gradient(90deg, rgba(122,58,154,0.4), rgba(224,90,43,0.25))',
        borderBottom: '1px solid var(--dv-border-dark)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        <Sparkles size={14} style={{ color: 'var(--ai-orange)' }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ai-orange)' }}>AI Video Generate</span>
        <span style={{ fontSize: 8, fontWeight: 700, background: 'var(--ai-orange)', color: '#fff', borderRadius: 8, padding: '2px 6px' }}>BETA</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--dv-text-muted)' }}>{credits} credits</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dv-text-muted)', display: 'flex', padding: 2 }}>
          <X size={13} />
        </button>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>

        {/* Prompt */}
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--dv-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 5 }}>
          Prompt
        </div>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="A cinematic shot of a neon-lit city at night, rain falling, slow motion…"
          rows={3}
          style={{
            width: '100%', background: 'var(--dv-panel-dark)', border: '1px solid var(--dv-border)',
            color: 'var(--dv-text)', fontSize: 11, borderRadius: 3, padding: '6px 8px',
            resize: 'none', outline: 'none', fontFamily: 'var(--font-ui)', lineHeight: 1.5, marginBottom: 4,
          }}
          onFocus={e => e.target.style.borderColor = 'var(--dv-blue)'}
          onBlur={e => e.target.style.borderColor = 'var(--dv-border)'}
        />

        {/* Sample prompts */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 8 }}>
          {SAMPLE_PROMPTS.map((p, i) => (
            <button key={i} onClick={() => setPrompt(p)} style={{
              fontSize: 9, background: 'var(--dv-panel-dark)', border: '1px solid var(--dv-border)',
              color: 'var(--dv-text-muted)', borderRadius: 3, padding: '2px 6px', cursor: 'pointer',
            }}>
              {p.slice(0, 20)}…
            </button>
          ))}
        </div>

        {/* Negative prompt toggle */}
        <button onClick={() => setShowNeg(v => !v)} style={{
          fontSize: 9, background: 'none', border: 'none', color: 'var(--dv-text-muted)',
          cursor: 'pointer', marginBottom: showNeg ? 4 : 8, padding: 0,
        }}>
          {showNeg ? '▾' : '▸'} Negative prompt
        </button>
        {showNeg && (
          <textarea
            value={negPrompt}
            onChange={e => setNegPrompt(e.target.value)}
            placeholder="blurry, distorted, watermark, text…"
            rows={2}
            style={{
              width: '100%', background: 'var(--dv-panel-dark)', border: '1px solid var(--dv-border)',
              color: 'var(--dv-text)', fontSize: 11, borderRadius: 3, padding: '5px 7px',
              resize: 'none', outline: 'none', fontFamily: 'var(--font-ui)', marginBottom: 8,
            }}
          />
        )}

        {/* Style */}
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--dv-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 5 }}>Style</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 10 }}>
          {STYLES.map(s => (
            <button key={s} onClick={() => setStyle(s)} style={{
              padding: '3px 8px', borderRadius: 10, border: '1px solid',
              borderColor: style === s ? 'var(--ai-orange)' : 'var(--dv-border)',
              background: style === s ? 'rgba(255,112,67,0.12)' : 'transparent',
              color: style === s ? 'var(--ai-orange)' : 'var(--dv-text-muted)',
              fontSize: 10, cursor: 'pointer',
            }}>{s}</button>
          ))}
        </div>

        {/* Duration + Resolution + Aspect */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--dv-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 5 }}>Duration</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {DURATIONS.map(d => (
                <button key={d} onClick={() => setDuration(d)} style={{
                  padding: '3px 7px', borderRadius: 3, border: '1px solid',
                  borderColor: duration === d ? 'var(--ai-orange)' : 'var(--dv-border)',
                  background: duration === d ? 'rgba(255,112,67,0.12)' : 'transparent',
                  color: duration === d ? 'var(--ai-orange)' : 'var(--dv-text-muted)',
                  fontSize: 10, cursor: 'pointer',
                }}>{d}s</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--dv-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 5 }}>Resolution</div>
            <div style={{ display: 'flex', gap: 3 }}>
              {RESOLUTIONS.map(r => (
                <button key={r} onClick={() => setResolution(r)} style={{
                  padding: '3px 7px', borderRadius: 3, border: '1px solid',
                  borderColor: resolution === r ? 'var(--ai-orange)' : 'var(--dv-border)',
                  background: resolution === r ? 'rgba(255,112,67,0.12)' : 'transparent',
                  color: resolution === r ? 'var(--ai-orange)' : 'var(--dv-text-muted)',
                  fontSize: 10, cursor: 'pointer',
                }}>{r}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Aspect ratio */}
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--dv-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 5 }}>Aspect Ratio</div>
        <div style={{ display: 'flex', gap: 3, marginBottom: 12 }}>
          {ASPECT.map(a => (
            <button key={a} onClick={() => setAspect(a)} style={{
              padding: '3px 7px', borderRadius: 3, border: '1px solid',
              borderColor: aspect === a ? 'var(--dv-blue)' : 'var(--dv-border)',
              background: aspect === a ? 'rgba(74,143,193,0.12)' : 'transparent',
              color: aspect === a ? 'var(--dv-blue)' : 'var(--dv-text-muted)',
              fontSize: 10, cursor: 'pointer',
            }}>{a}</button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ fontSize: 10, color: 'var(--dv-accent)', marginBottom: 8, padding: '5px 8px', background: 'rgba(224,90,43,0.1)', borderRadius: 3, border: '1px solid rgba(224,90,43,0.3)' }}>
            ⚠ {error}
          </div>
        )}

        {/* Progress */}
        {generating && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: 'var(--dv-text-dim)' }}>{statusMsg}</span>
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--dv-text-muted)' }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height: 3, background: 'var(--dv-border)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--ai-orange), #e05a2b)', borderRadius: 2, width: `${progress}%`, transition: 'width 0.4s ease' }} />
            </div>
          </div>
        )}

        {/* Generate button */}
        <button
          className="btn btn-ai"
          onClick={generate}
          disabled={generating || !prompt.trim()}
          style={{ width: '100%', justifyContent: 'center', padding: '9px', fontSize: 12, borderRadius: 4, marginBottom: 10, opacity: generating ? 0.7 : 1 }}
        >
          <Wand2 size={13} />
          {generating ? 'Generating…' : `Generate Video · 1 Credit`}
        </button>

        {/* Powered by row */}
        <div style={{ padding: '6px 8px', background: 'var(--dv-panel-dark)', borderRadius: 3, border: '1px solid var(--dv-border-dark)', marginBottom: 10 }}>
          <div style={{ fontSize: 9, color: 'var(--dv-text-muted)', marginBottom: 4 }}>POWERED BY</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#4285f4' }}>Veo 3</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#ff4444' }}>Runway</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#aaaaff' }}>Sora</span>
          </div>
        </div>

        {/* Generated results */}
        {results.length > 0 && (
          <>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--dv-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
              Generated ({results.length})
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
              {results.map(v => (
                <div key={v.id} style={{
                  background: 'var(--dv-panel-dark)', border: '1px solid var(--dv-border)',
                  borderRadius: 3, overflow: 'hidden', cursor: 'pointer',
                }} title={v.prompt}>
                  <div style={{
                    height: 52, background: 'linear-gradient(135deg, #2a1040 0%, #401030 50%, #1a2040 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ai-orange)',
                  }}>
                    <Sparkles size={18} />
                  </div>
                  <div style={{ padding: '4px 5px' }}>
                    <div style={{ fontSize: 9, color: 'var(--dv-text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {v.style} · {v.duration}s
                    </div>
                    <div style={{ fontSize: 8, color: 'var(--dv-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>
                      {v.prompt.slice(0, 30)}…
                    </div>
                    <button onClick={() => addAiMedia(v)} style={{
                      marginTop: 4, width: '100%', fontSize: 8, padding: '2px',
                      background: 'var(--dv-panel-mid)', border: '1px solid var(--dv-border)',
                      color: 'var(--dv-text-dim)', borderRadius: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
                    }}>
                      <Plus size={8} /> Add to Pool
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--dv-text-muted)' }}>
          cstdineshroshan · C!neAI AI Engine v2.0
        </div>
      </div>
    </div>
  );
}
