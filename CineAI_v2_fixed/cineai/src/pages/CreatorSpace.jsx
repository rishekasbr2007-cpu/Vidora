import { useState } from 'react';
import { Plus, Film, Eye, Heart, Share2, Settings, Upload, Users, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import CreatorIcon from '../components/CreatorIcon';

const MOCK_PROJECTS = [
  { id: 1, title: 'Neon City Promo',    views: 12400, likes: 890,  tags: ['cinematic', 'ai'],  hasAi: true,  duration: '2:34', thumb: 'linear-gradient(135deg,#1a0a2e,#3a0a6e)' },
  { id: 2, title: 'Mountain Timelapse', views: 35600, likes: 2010, tags: ['nature', '4k'],      hasAi: false, duration: '1:12', thumb: 'linear-gradient(135deg,#0a2e1a,#0a4e2a)' },
  { id: 3, title: 'Abstract Motion',    views: 7800,  likes: 450,  tags: ['abstract', 'vfx'],  hasAi: true,  duration: '0:45', thumb: 'linear-gradient(135deg,#2e0a1a,#5e0a3a)' },
  { id: 4, title: 'Product Showcase',   views: 21000, likes: 1340, tags: ['commercial'],        hasAi: false, duration: '1:58', thumb: 'linear-gradient(135deg,#0a1a2e,#0a2e5e)' },
  { id: 5, title: 'AI Dream Sequence',  views: 5400,  likes: 320,  tags: ['ai', 'surreal'],    hasAi: true,  duration: '0:30', thumb: 'linear-gradient(135deg,#2e0a2e,#4e0a4e)' },
  { id: 6, title: 'Street Documentary', views: 18000, likes: 1100, tags: ['documentary', '4k'], hasAi: false, duration: '4:20', thumb: 'linear-gradient(135deg,#1a1a0a,#2e2e0a)' },
];

const EXPLORE_CREATORS = [
  { name: 'AlexCinema',   handle: 'alexcinema',   followers: '12.4K', badge: '🎬', col: 'linear-gradient(135deg,#7c3aed,#3b82f6)' },
  { name: 'NeonFilms',    handle: 'neonfilms',    followers: '8.1K',  badge: '⚡', col: 'linear-gradient(135deg,#ec4899,#8b5cf6)' },
  { name: 'VisuAlize',    handle: 'visualize',    followers: '24.7K', badge: '👁', col: 'linear-gradient(135deg,#10b981,#059669)' },
  { name: 'ByteFrame',    handle: 'byteframe',    followers: '5.3K',  badge: '💻', col: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  { name: 'ArtistAI',     handle: 'artistai',     followers: '31.2K', badge: '✦', col: 'linear-gradient(135deg,#ef4444,#dc2626)' },
];

export default function CreatorSpace() {
  const { user } = useAuth();
  const [tab, setTab] = useState('projects');

  const displayName = user?.creatorSpace?.displayName || user?.username || 'Creator';
  const handle      = user?.creatorSpace?.handle      || user?.username?.toLowerCase() || 'creator';

  return (
    <div className="creator-page">
      {/* Banner */}
      <div className="creator-banner" style={{ background: 'linear-gradient(135deg, #0a0014 0%, #14002a 40%, #0a0a20 100%)' }}>
        {/* Animated dots */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15, pointerEvents: 'none' }}>
          <defs><pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="1" fill="#fff"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#dots)"/>
        </svg>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 30% 50%, rgba(122,58,154,0.4) 0%, transparent 70%)' }} />
      </div>

      {/* Profile row */}
      <div className="creator-header-row">
        <div style={{ position: 'relative' }}>
          <div className="creator-avatar">{displayName[0]?.toUpperCase()}</div>
          {/* Creator badge icon */}
          <div style={{ position: 'absolute', bottom: -4, right: -4 }}>
            <CreatorIcon size={28} />
          </div>
        </div>
        <div style={{ flex: 1, paddingBottom: 4 }}>
          <div className="creator-name">{displayName}</div>
          <div className="creator-handle">@{handle}</div>
          <div className="creator-stats">
            <div><div className="creator-stat-num">{MOCK_PROJECTS.length}</div><div className="creator-stat-lbl">Projects</div></div>
            <div><div className="creator-stat-num">0</div><div className="creator-stat-lbl">Followers</div></div>
            <div><div className="creator-stat-num">0</div><div className="creator-stat-lbl">Following</div></div>
            <div><div className="creator-stat-num">80.2K</div><div className="creator-stat-lbl">Views</div></div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, paddingBottom: 4 }}>
          <button className="btn"><Settings size={11}/> Edit Profile</button>
          <button className="btn btn-accent"><Upload size={11}/> Publish</button>
        </div>
      </div>

      {/* Bio */}
      <div style={{ padding: '0 28px 16px', maxWidth: 600 }}>
        <p style={{ fontSize: 12, color: 'var(--dv-text-dim)', lineHeight: 1.6 }}>
          {user?.bio || 'AI-powered video creator. Building the future of cinema with Vidora.'}
        </p>
        <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--dv-text-muted)' }}>
          cstdineshroshan · {user?.plan?.toUpperCase() || 'FREE'} Plan · {user?.aiCredits ?? 10} AI Credits
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--dv-border)', padding: '0 28px' }}>
        {['projects', 'ai-videos', 'explore', 'analytics'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 18px', border: 'none',
            borderBottom: `2px solid ${tab === t ? 'var(--dv-accent)' : 'transparent'}`,
            background: 'transparent',
            color: tab === t ? 'var(--dv-text)' : 'var(--dv-text-muted)',
            fontSize: 11, fontWeight: tab === t ? 600 : 400,
            cursor: 'pointer', textTransform: 'capitalize', transition: 'var(--trans)',
          }}>{t.replace('-', ' ')}</button>
        ))}
      </div>

      <div className="creator-content">
        {tab === 'projects' && (
          <div className="proj-grid">
            {/* New project card */}
            <div className="proj-card" style={{ border: '1.5px dashed var(--dv-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 160, color: 'var(--dv-text-muted)' }}>
              <Plus size={22} style={{ marginBottom: 8 }} />
              <span style={{ fontSize: 11, fontWeight: 600 }}>New Project</span>
            </div>
            {MOCK_PROJECTS.map(p => (
              <div key={p.id} className="proj-card">
                <div className="proj-thumb" style={{ background: p.thumb }}>
                  <Film size={26} />
                  {p.hasAi && <span style={{ position: 'absolute', top: 6, left: 6, fontSize: 8, fontWeight: 700, background: 'var(--ai-orange)', color: '#fff', borderRadius: 10, padding: '2px 6px' }}>AI</span>}
                  <span style={{ position: 'absolute', bottom: 6, right: 6, fontFamily: 'var(--font-mono)', fontSize: 9, background: 'rgba(0,0,0,0.6)', color: '#ccc', padding: '1px 4px', borderRadius: 2 }}>{p.duration}</span>
                </div>
                <div className="proj-info">
                  <div className="proj-title">{p.title}</div>
                  <div className="proj-meta" style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 4 }}>
                    <span><Eye size={9} style={{ display: 'inline', marginRight: 2 }} />{p.views.toLocaleString()}</span>
                    <span><Heart size={9} style={{ display: 'inline', marginRight: 2 }} />{p.likes.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginTop: 5 }}>
                    {p.tags.map(t => (
                      <span key={t} style={{ fontSize: 9, background: 'var(--dv-panel-mid)', border: '1px solid var(--dv-border)', color: 'var(--dv-text-muted)', borderRadius: 2, padding: '1px 5px' }}>#{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'ai-videos' && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--dv-text-muted)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✦</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dv-text-dim)', marginBottom: 6 }}>No AI videos published yet</div>
            <div style={{ fontSize: 11 }}>Generate videos in the AI panel and publish them to your Creator Space</div>
          </div>
        )}

        {tab === 'explore' && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--dv-text-bright)', marginBottom: 3 }}>Discover Creators</div>
              <div style={{ fontSize: 11, color: 'var(--dv-text-muted)' }}>Find and follow talented video creators on C!neAI</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              {EXPLORE_CREATORS.map((c, i) => (
                <div key={c.name} style={{ background: 'var(--dv-panel)', border: '1px solid var(--dv-border)', borderRadius: 6, padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'var(--trans)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--dv-blue)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--dv-border)'}
                >
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: c.col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{c.badge}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--dv-text)' }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--dv-text-muted)' }}>{c.followers} followers</div>
                  <button className="btn" style={{ padding: '3px 14px', fontSize: 10 }}>Follow</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'analytics' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
              {[['Total Views', '80.2K', <Eye size={16}/>], ['Likes', '6.1K', <Heart size={16}/>], ['Followers', '0', <Users size={16}/>], ['Trending', '#12', <TrendingUp size={16}/>]].map(([l, v, ic]) => (
                <div key={l} style={{ background: 'var(--dv-panel)', border: '1px solid var(--dv-border)', borderRadius: 6, padding: 14 }}>
                  <div style={{ color: 'var(--dv-text-muted)', marginBottom: 8 }}>{ic}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--dv-text-bright)' }}>{v}</div>
                  <div style={{ fontSize: 10, color: 'var(--dv-text-muted)', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--dv-text-muted)', textAlign: 'center', padding: 20 }}>
              Detailed analytics coming soon
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
