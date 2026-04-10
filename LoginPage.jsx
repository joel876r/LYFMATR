import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data);
      navigate(data.user_type === 'student' ? '/student/dashboard' : '/company/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'grid', gridTemplateColumns: '1fr 480px', overflow: 'hidden' }}>

      {/* Left panel - blue edu branding */}
      <div className="hero-edu" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 3.5rem', position: 'relative' }}>
        <div style={{ maxWidth: 400 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>🎓</div>
          <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 900, fontSize: '2rem', color: '#fff', lineHeight: 1.2, marginBottom: '1rem' }}>
            Welcome back to EduBridge
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, fontSize: '0.95rem', marginBottom: '2rem' }}>
            Your AI-powered career platform connecting education with industry opportunities.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {['🤖 AI Skill Gap Analysis with Google Gemini', '🎯 Ranked opportunity matching', '📈 Personalized learning paths'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem', color: 'rgba(255,255,255,0.85)' }}>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div style={{ background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 2.5rem', boxShadow: '-6px 0 30px rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: 380, width: '100%', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.65rem', color: '#1C1D1F', marginBottom: '0.35rem' }}>Sign in</h1>
          <p style={{ color: '#6B6B6B', marginBottom: '2rem', fontSize: '0.9rem' }}>
            New to EduBridge? <Link to="/register" style={{ color: '#0056D2', fontWeight: 600, textDecoration: 'none' }}>Create an account</Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label className="label">Email address</label>
              <input id="login-email" className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="label">Password</label>
              <input id="login-password" className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {error && <div className="alert-error">{error}</div>}
            <button id="login-submit" className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.78rem', fontSize: '0.95rem', marginTop: '0.4rem' }}>
              {loading ? (
                <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2.5 }} /> Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="divider" />

          <div style={{ background: '#F6F7FB', borderRadius: 10, padding: '1rem', fontSize: '0.83rem', color: '#6B6B6B', lineHeight: 1.6 }}>
            <strong style={{ color: '#3D3D3D' }}>Demo accounts:</strong><br />
            Student: <code style={{ background: '#E8ECEF', padding: '0.1rem 0.35rem', borderRadius: 4 }}>alex@test.com / password123</code>
          </div>
        </div>
      </div>
    </div>
  );
}
