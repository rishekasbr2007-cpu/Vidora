import { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import CameraIcon from '../components/CameraIcon';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(username, email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-left">
        <div className="auth-left-bg" />
        <div className="auth-camera-logo">
          <CameraIcon size={120} />
          <h1 className="auth-brand">VID<em>ORA</em></h1>
          <p className="auth-tagline">Professional Cinema Editing for Everyone</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-card-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="auth-card-sub">
            {isLogin ? 'Login to continue your projects' : 'Join the community of creators'}
          </p>

          <div className="auth-tabs">
            <button 
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button 
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Username</label>
                <div style={{ position: 'relative' }}>
                  <User size={14} style={{ position: 'absolute', left: 10, top: 10, color: '#666' }} />
                  <input 
                    type="text" 
                    placeholder="creator_name" 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    style={{ paddingLeft: 32 }}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: 10, top: 10, color: '#666' }} />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{ paddingLeft: 32 }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: 10, top: 10, color: '#666' }} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: 32 }}
                />
              </div>
            </div>

            {error && <div className="form-error">{error}</div>}

            <button 
              type="submit" 
              className="btn btn-accent" 
              style={{ width: '100%', justifyContent: 'center', height: 38, marginTop: 10 }}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} style={{ marginLeft: 8 }} />
                </>
              )}
            </button>
          </form>

          {isLogin && (
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <a href="#" style={{ fontSize: 11, color: 'var(--dv-blue)', textDecoration: 'none' }}>
                Forgot Password?
              </a>
            </div>
          )}

          <div className="auth-code-tag">
            VIDORA ENGINE v2.0.0_STABLE
          </div>
        </div>
      </div>
    </div>
  );
}
