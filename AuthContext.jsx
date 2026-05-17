import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);
const API = '/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('cineai_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => d?.user ? setUser(d.user) : logout())
      .catch(logout)
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const r = await fetch(`${API}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message || 'Login failed');
    localStorage.setItem('cineai_token', d.token);
    setToken(d.token); setUser(d.user);
  };

  const signup = async (username, email, password) => {
    const r = await fetch(`${API}/auth/signup`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message || 'Signup failed');
    localStorage.setItem('cineai_token', d.token);
    setToken(d.token); setUser(d.user);
  };

  const logout = useCallback(() => {
    localStorage.removeItem('cineai_token');
    setToken(null); setUser(null);
  }, []);

  const authFetch = useCallback((url, opts = {}) =>
    fetch(url, { ...opts, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...opts.headers } })
  , [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
