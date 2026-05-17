import { useState, useRef, useEffect } from 'react';

export default function ColorWheel({ label, value = { x: 0, y: 0 }, exp = 0, sat = 1, onChange, onExpChange, onSatChange }) {
  const wheelRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e) => {
    if (!isDragging || !wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const x = (e.clientX - rect.left - cx) / cx;
    const y = (e.clientY - rect.top - cy) / cy;
    
    const dist = Math.sqrt(x * x + y * y);
    if (dist > 1) {
      onChange({ x: x / dist, y: y / dist });
    } else {
      onChange({ x, y });
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      const stop = () => setIsDragging(false);
      window.addEventListener('mouseup', stop);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', stop);
      };
    }
  }, [isDragging]);

  const dotX = value.x * 35 + 50;
  const dotY = value.y * 35 + 50;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: 120 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--dv-text)', textTransform: 'capitalize' }}>
        {label}
      </div>
      
      <div 
        ref={wheelRef}
        onMouseDown={() => setIsDragging(true)}
        style={{
          width: 90, height: 90, borderRadius: '50%',
          background: 'conic-gradient(from 180deg, red, yellow, lime, aqua, blue, magenta, red)',
          position: 'relative', border: '2px solid #222',
          cursor: 'crosshair', boxShadow: 'inset 0 0 15px rgba(0,0,0,0.7)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, #000 0%, transparent 80%)', opacity: 0.2 }} />
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.05)' }} />
        
        <div style={{
          position: 'absolute',
          left: `${dotX}%`, top: `${dotY}%`,
          width: 8, height: 8, borderRadius: '50%',
          background: '#fff', border: '1px solid #000',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 6px rgba(0,0,0,0.9)'
        }} />
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 8, color: 'var(--dv-text-muted)', width: 20 }}>Exp</span>
          <input type="range" min="-2" max="2" step="0.01" value={exp} onChange={e => onExpChange(parseFloat(e.target.value))} style={{ flex: 1, height: 2 }} />
          <span style={{ fontSize: 8, color: 'var(--dv-text)', width: 24, textAlign: 'right' }}>{exp.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 8, color: 'var(--dv-text-muted)', width: 20 }}>Sat</span>
          <input type="range" min="0" max="2" step="0.01" value={sat} onChange={e => onSatChange(parseFloat(e.target.value))} style={{ flex: 1, height: 2 }} />
          <span style={{ fontSize: 8, color: 'var(--dv-text)', width: 24, textAlign: 'right' }}>{sat.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
           <div style={{ fontSize: 8, color: 'var(--dv-text-muted)' }}>X: {value.x.toFixed(2)}</div>
           <div style={{ fontSize: 8, color: 'var(--dv-text-muted)' }}>Y: {value.y.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
