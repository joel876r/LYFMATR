import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function RegisterPage() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', user_type: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data);
      navigate(data.user_type === 'student' ? '/student/dashboard' : '/company/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const isStudent = form.user_type === 'student';

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: '#F6F7FB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 820, background: '#fff', borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.10)', overflow: 'hidden', display: 'grid', gridTemplateColumns: '260px 1fr' }}>

        {/* Left sidebar */}
        <div style={{ background: '#F6F7FB', borderRight: '1px solid #E8ECEF', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1rem', color: '#0056D2' }}>🎓 EduBridge</div>
            <div style={{ fontSize: '0.78rem', color: '#9AA3B0', fontWeight: 500, marginTop: '0.25rem' }}>Career Platform</div>
          </div>
          <h3 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#3D3D3D', marginBottom: '1rem' }}>I am a...</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {[
              { type: 'student', icon: '🎓', title: 'Student', desc: 'Find internships, get AI skill analysis, and grow your career' },
              { type: 'company', icon: '🏢', title: 'Company / Recruiter', desc: 'Post opportunities and discover top student talent' },
            ].map(opt => (
              <button key={opt.type} type="button" id={`register-type-${opt.type}`} onClick={() => setForm(f => ({ ...f, user_type: opt.type }))} style={{
                text_align: 'left', background: form.user_type === opt.type ? '#E8F0FE' : '#fff',
                border: `2px solid ${form.user_type === opt.type ? '#0056D2' : '#E8ECEF'}`,
                borderRadius: 10, padding: '0.85rem 1rem', cursor: 'pointer', transition: 'all 0.18s', textAlign: 'left',
              }}>
                <div style={{ fontSize: '1.3rem', marginBottom: '0.35rem' }}>{opt.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: form.user_type === opt.type ? '#0056D2' : '#1C1D1F' }}>{opt.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#6B6B6B', lineHeight: 1.4, marginTop: '0.2rem' }}>{opt.desc}</div>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '2rem', fontSize: '0.78rem', color: '#9AA3B0', lineHeight: 1.6 }}>
            By joining, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>

        {/* Right form */}
        <div style={{ padding: '2.5rem 2.25rem' }}>
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#1C1D1F', marginBottom: '0.3rem' }}>
            Create your {isStudent ? 'student' : 'company'} account
          </h1>
          <p style={{ color: '#6B6B6B', marginBottom: '1.75rem', fontSize: '0.88rem' }}>
            Already have an account? <Link to="/login" style={{ color: '#0056D2', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">{isStudent ? 'Full Name' : 'Contact Person Name'}</label>
              <input id="register-name" className="input" type="text" value={form.full_name} onChange={set('full_name')} placeholder={isStudent ? 'e.g. Priya Sharma' : 'e.g. Rahul Singh'} required />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input id="register-email" className="input" type="email" value={form.email} onChange={set('email')} placeholder={isStudent ? 'student@college.edu' : 'hr@company.com'} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input id="register-password" className="input" type="password" value={form.password} onChange={set('password')} placeholder="At least 6 characters" minLength={6} required />
            </div>

            {/* Student extra info banner */}
            {isStudent && (
              <div style={{ background: '#E8F0FE', border: '1px solid #C3D9F8', borderRadius: 8, padding: '0.85rem 1rem', fontSize: '0.82rem', color: '#0056D2', lineHeight: 1.6 }}>
                📚 After creating your account, you'll be able to add your skills and education to get AI-matched opportunities.
              </div>
            )}

            {error && <div className="alert-error">{error}</div>}

            <button id="register-submit" className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2.5, borderTopColor: '#fff' }} /> Creating Account...</> : `Create ${isStudent ? 'Student' : 'Company'} Account →`}
            </button>
          </form>

          <div className="divider" />

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {['🔒 Secure', '🆓 Always Free', '⚡ Instant Access'].map(f => (
              <span key={f} style={{ fontSize: '0.78rem', color: '#6B6B6B', background: '#F6F7FB', padding: '0.3rem 0.7rem', borderRadius: 999, border: '1px solid #E8ECEF' }}>{f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
