import { Film, Sparkles, Clock, FolderOpen, Plus, ExternalLink } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import CameraIcon from '../components/CameraIcon';
import DeveloperIcon from '../components/DeveloperIcon';
import CreatorIcon from '../components/CreatorIcon';

const RECENT = [
  { name: 'Neon City Promo',    time: '2h ago',  type: 'ai',    dur: '2:34' },
  { name: 'Mountain Timelapse', time: '1d ago',  type: 'video', dur: '1:12' },
  { name: 'Product Showcase',   time: '3d ago',  type: 'video', dur: '1:58' },
  { name: 'AI Dream Sequence',  time: '5d ago',  type: 'ai',    dur: '0:30' },
];

const API_ENDPOINTS = [
  { method: 'POST', path: '/api/auth/signup',             desc: 'Create account' },
  { method: 'POST', path: '/api/auth/login',              desc: 'Sign in' },
  { method: 'GET',  path: '/api/projects',                desc: 'List projects' },
  { method: 'POST', path: '/api/projects',                desc: 'Create project' },
  { method: 'POST', path: '/api/ai/generate-video',       desc: 'Generate AI video' },
  { method: 'GET',  path: '/api/creator/:handle',         desc: 'Public profile' },
];

export default function Dashboard({ setActivePage }) {
  const { user } = useAuth();

  return (
    <div className="dash-page">
      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--dv-text-muted)', marginBottom: 8, letterSpacing: 2, textTransform: 'uppercase' }}>
          Antigravity Studio · cstdineshroshan
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
          <CameraIcon size={44} />
          <div>
            <div className="dash-welcome">Welcome back, {user?.username || 'Creator'} ✦</div>
            <div className="dash-sub">Professional AI-powered video editor · C!neAI v2.0</div>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button className="btn btn-accent" onClick={() => setActivePage('edit')} style={{ padding: '7px 16px' }}>
            <Film size={12}/> Open Editor
          </button>
          <button className="btn btn-ai" onClick={() => setActivePage('edit')} style={{ padding: '7px 16px' }}>
            <Sparkles size={12}/> AI Generate
          </button>
          <button className="btn" onClick={() => setActivePage('creator')} style={{ padding: '7px 16px' }}>
            <span style={{ fontSize: 11 }}>🌟</span> Creator Space
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        {[
          { label: 'Projects',    value: '4',    sub: '+1 this week',  color: 'var(--dv-blue)' },
          { label: 'AI Credits',  value: user?.aiCredits ?? 10, sub: 'Free plan', color: 'var(--ai-orange)' },
          { label: 'Total Views', value: '80.2K', sub: '+12% this month', color: '#7ee787' },
          { label: 'Followers',   value: '0',    sub: 'Start publishing',  color: '#d2a8ff' },
        ].map(s => (
          <div key={s.label} className="dash-stat-card">
            <div className="dash-stat-num" style={{ color: s.color }}>{s.value}</div>
            <div className="dash-stat-lbl">{s.label}</div>
            <div style={{ fontSize: 9, color: 'var(--dv-text-muted)', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent projects */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div className="dash-section-title">Recent Projects</div>
            <button className="btn btn-ghost" style={{ padding: '2px 8px', fontSize: 10 }}>
              <Plus size={10}/> New
            </button>
          </div>
          <div className="dash-recent">
            {RECENT.map(r => (
              <div key={r.name} className="dash-recent-item" onClick={() => setActivePage('edit')}>
                <div style={{
                  width: 32, height: 32, borderRadius: 4, flexShrink: 0,
                  background: r.type === 'ai' ? 'linear-gradient(135deg,#7a3a9a,#e05a2b)' : 'var(--dv-panel-mid)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: r.type === 'ai' ? '#fff' : 'var(--dv-text-muted)',
                }}>
                  {r.type === 'ai' ? <Sparkles size={13}/> : <Film size={13}/>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--dv-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--dv-text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                    <Clock size={9}/> {r.time} · {r.dur}
                  </div>
                </div>
                <FolderOpen size={12} style={{ color: 'var(--dv-text-muted)' }}/>
              </div>
            ))}
          </div>
        </div>

        {/* Role cards - Developer & Creator */}
        <div>
          <div className="dash-section-title" style={{ marginBottom: 10 }}>Your Roles</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Developer Card */}
            <div style={{
              background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
              border: '1px solid #30363d',
              borderRadius: 6, padding: 14, cursor: 'pointer', transition: 'var(--trans)',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#58a6ff'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#30363d'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <DeveloperIcon size={44} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#58a6ff', marginBottom: 2 }}>Developer</div>
                  <div style={{ fontSize: 10, color: '#8b949e', lineHeight: 1.5 }}>
                    Build on C!neAI APIs. Integrate AI video generation into your apps.
                  </div>
                  <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 9, color: '#3fb950' }}>
                    API key: ck_demo_cstdineshroshan
                  </div>
                </div>
                <ExternalLink size={12} style={{ color: '#58a6ff' }}/>
              </div>
            </div>

            {/* Creator Card */}
            <div style={{
              border: '1px solid #4a2878',
              borderRadius: 6, padding: 14, cursor: 'pointer', transition: 'var(--trans)',
              background: 'linear-gradient(135deg, #0d0a14 0%, #1a0f2e 100%)',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#ffd700'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#4a2878'}
              onClick={() => setActivePage('creator')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CreatorIcon size={44} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#ffd700', marginBottom: 2 }}>Creator</div>
                  <div style={{ fontSize: 10, color: '#8b7aa0', lineHeight: 1.5 }}>
                    Publish your videos, grow your audience, and monetize your content.
                  </div>
                  <div style={{ marginTop: 6, fontSize: 9, color: '#c084fc' }}>
                    @{user?.creatorSpace?.handle || user?.username || 'creator'} · 0 followers
                  </div>
                </div>
                <ExternalLink size={12} style={{ color: '#ffd700' }}/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Reference */}
      <div style={{ marginTop: 24 }}>
        <div className="dash-section-title" style={{ marginBottom: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DeveloperIcon size={20} /> API Reference
          </span>
        </div>
        <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, overflow: 'hidden' }}>
          {API_ENDPOINTS.map((ep, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '7px 14px',
              borderBottom: i < API_ENDPOINTS.length - 1 ? '1px solid #21262d' : 'none',
              fontFamily: 'var(--font-mono)',
            }}>
              <span style={{
                fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, minWidth: 36, textAlign: 'center',
                background: ep.method === 'GET' ? 'rgba(56,139,253,0.15)' : 'rgba(63,185,80,0.15)',
                color: ep.method === 'GET' ? '#388bfd' : '#3fb950',
                border: `1px solid ${ep.method === 'GET' ? '#1f3a5f' : '#1f3a2a'}`,
              }}>{ep.method}</span>
              <span style={{ fontSize: 10, color: '#58a6ff', flex: 1 }}>{ep.path}</span>
              <span style={{ fontSize: 10, color: '#8b949e' }}>{ep.desc}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--dv-text-muted)' }}>
          Base URL: <span style={{ color: '#58a6ff' }}>http://localhost:5000</span> · Code: <span style={{ color: '#3fb950' }}>cstdineshroshan</span>
        </div>
      </div>
    </div>
  );
}
