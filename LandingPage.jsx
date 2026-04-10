import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { icon: '💻', label: 'Software Development', count: '1,240+' },
  { icon: '📊', label: 'Data Science & AI', count: '870+' },
  { icon: '🎨', label: 'UI/UX Design', count: '430+' },
  { icon: '📈', label: 'Business & Marketing', count: '620+' },
  { icon: '☁️', label: 'Cloud & DevOps', count: '390+' },
  { icon: '🔒', label: 'Cybersecurity', count: '210+' },
];

const STATS = [
  { value: '12,500+', label: 'Active Students' },
  { value: '800+', label: 'Partner Companies' },
  { value: '4,200+', label: 'Opportunities' },
  { value: '94%', label: 'Placement Rate' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'SDE Intern @ Google', text: "EduBridge's AI told me exactly which skills I was missing. I landed my dream internship within 3 months!", avatar: 'P' },
  { name: 'Rahul Mehra', role: 'Data Analyst @ Flipkart', text: "The match score feature saved me hours of scrolling. I applied to the top 5 matches and got 3 interviews.", avatar: 'R' },
  { name: 'Ananya Iyer', role: 'Product Intern @ Swiggy', text: "Loved how the platform showed my skill gap as a roadmap, not just a list of missing skills.", avatar: 'A' },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div style={{ background: '#fff' }}>

      {/* ── HERO ── */}
      <div className="hero-edu" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 420px', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div className="badge badge-blue" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', marginBottom: '1.2rem' }}>
              ✨ AI-Powered Career Platform
            </div>
            <h1 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.18, marginBottom: '1.2rem' }}>
              Your bridge from<br />
              <span style={{ color: '#93C5FD' }}>Education</span> to{' '}
              <span style={{ color: '#6EE7B7' }}>Industry</span>
            </h1>
            <p style={{ fontSize: '1.07rem', color: 'rgba(255,255,255,0.82)', marginBottom: '2rem', lineHeight: 1.75, maxWidth: 480 }}>
              Get AI-powered skill gap analysis, discover perfectly matched internships and projects, and build the career you deserve.
            </p>
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              {user ? (
                <Link to={user.user_type === 'student' ? '/student/dashboard' : '/company/dashboard'}>
                  <button className="btn-primary" style={{ background: '#fff', color: '#0056D2', padding: '0.82rem 2rem', fontSize: '0.97rem' }}>Go to Dashboard →</button>
                </Link>
              ) : (
                <>
                  <Link to="/register"><button className="btn-primary" style={{ background: '#fff', color: '#0056D2', padding: '0.82rem 2rem', fontSize: '0.97rem' }}>Get Started Free →</button></Link>
                  <Link to="/login"><button style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '0.82rem 2rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.97rem' }}>Sign In</button></Link>
                </>
              )}
            </div>

            {/* Logos strip */}
            <div style={{ marginTop: '2.2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Trusted by students from</span>
              {['IIT', 'BITS', 'NIT', 'VIT', 'DTU'].map(u => (
                <span key={u} style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: 4 }}>{u}</span>
              ))}
            </div>
          </div>

          {/* Hero card */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 42, height: 42, background: '#E8F0FE', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🤖</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1C1D1F' }}>AI Skill Gap Report</div>
                <div style={{ fontSize: '0.76rem', color: '#9AA3B0' }}>Data Engineer Role</div>
              </div>
              <span className="badge badge-green" style={{ marginLeft: 'auto' }}>Ready</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {[{ skill: 'Apache Spark', level: 0, color: '#D93025', remark: 'Critical' }, { skill: 'AWS Glue', level: 20, color: '#F9AB00', remark: 'Recommended' }, { skill: 'Python', level: 85, color: '#00897B', remark: 'Strong' }, { skill: 'SQL', level: 70, color: '#00897B', remark: 'Good' }].map(s => (
                <div key={s.skill}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#3D3D3D' }}>{s.skill}</span>
                    <span style={{ fontSize: '0.72rem', color: s.color, fontWeight: 600 }}>{s.remark}</span>
                  </div>
                  <div className="progress-bg"><div className="progress-fill" style={{ width: `${s.level}%`, background: s.color }} /></div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1.1rem', padding: '0.75rem', background: '#F6F7FB', borderRadius: 8, fontSize: '0.8rem', color: '#3D3D3D', lineHeight: 1.5 }}>
              🗺️ <strong>Next step:</strong> Complete "Apache Spark Fundamentals" on Coursera (6 hours)
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ background: '#F6F7FB', borderTop: '1px solid #E8ECEF', borderBottom: '1px solid #E8ECEF', padding: '2.5rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', textAlign: 'center' }}>
          {STATS.map(s => (
            <div key={s.label} className="stat-box">
              <div className="value">{s.value}</div>
              <div className="label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ padding: '5rem 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ color: '#0056D2', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>How It Works</p>
          <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '2rem', color: '#1C1D1F' }}>3 steps to your dream career</h2>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem' }}>
          {[
            { step: '01', icon: '📝', title: 'Build Your Profile', desc: 'Add your skills, education background, and interests. The more you share, the smarter the matches.' },
            { step: '02', icon: '🤖', title: 'AI Skill Gap Analysis', desc: 'Our Gemini AI compares your skills to real job requirements and generates a personalized learning roadmap.' },
            { step: '03', icon: '🎯', title: 'Match & Apply', desc: "Browse opportunities ranked by your skill match score. See exactly what you already know and what's missing." },
          ].map(h => (
            <div key={h.step} className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C3D9F8', fontFamily: 'Poppins,sans-serif', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>STEP {h.step}</div>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{h.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1C1D1F', marginBottom: '0.6rem' }}>{h.title}</h3>
              <p style={{ color: '#6B6B6B', fontSize: '0.88rem', lineHeight: 1.7 }}>{h.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div style={{ padding: '4rem 1.5rem', background: '#F6F7FB' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.75rem', color: '#1C1D1F', marginBottom: '1.75rem' }}>Explore opportunity categories</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
            {CATEGORIES.map(c => (
              <div key={c.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem 1.25rem', cursor: 'pointer' }}>
                <div style={{ fontSize: '1.6rem', flexShrink: 0 }}>{c.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1C1D1F' }}>{c.label}</div>
                  <div style={{ fontSize: '0.78rem', color: '#9AA3B0', fontWeight: 500 }}>{c.count} opportunities</div>
                </div>
                <span style={{ marginLeft: 'auto', color: '#C0C8D4', fontSize: '1rem' }}>›</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div style={{ padding: '4rem 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.75rem', color: '#1C1D1F', marginBottom: '1.75rem', textAlign: 'center' }}>What students are saying</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '1.5rem', color: '#F9AB00', marginBottom: '0.75rem' }}>★★★★★</div>
                <p style={{ color: '#3D3D3D', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.1rem' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E8F0FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0056D2', fontSize: '0.9rem' }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1C1D1F' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9AA3B0' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="hero-edu" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 900, fontSize: '2rem', color: '#fff', marginBottom: '1rem' }}>Ready to bridge the gap?</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', fontSize: '1rem' }}>Join 12,500+ students already using EduBridge.</p>
        <Link to="/register">
          <button className="btn-primary" style={{ background: '#fff', color: '#0056D2', padding: '0.9rem 2.5rem', fontSize: '1rem', fontWeight: 700 }}>Create Free Account →</button>
        </Link>
      </div>

      {/* Footer */}
      <div style={{ background: '#0F172A', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, color: '#fff', fontSize: '1rem' }}>🎓 EduBridge</div>
          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>© 2026 EduBridge · AI-powered career platform · Built for hackathon</div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {['About', 'Privacy', 'Terms'].map(l => <a key={l} href="#" style={{ fontSize: '0.8rem', color: '#64748B', textDecoration: 'none' }}>{l}</a>)}
          </div>
        </div>
      </div>
    </div>
  );
}
