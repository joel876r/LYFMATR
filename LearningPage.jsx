import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const PLATFORM_COLORS = {
  Coursera: '#0056D2', YouTube: '#D93025', Udemy: '#A435F0',
  'fast.ai': '#00897B', 'AWS Free Tier': '#F9AB00', LeetCode: '#F77F00', default: '#3D3D3D',
};
const LEVEL_COLORS = { Beginner: '#00897B', Intermediate: '#B35B00', Advanced: '#D93025', 'All levels': '#0056D2' };
const STORAGE_KEY = 'edubridge_completed_courses';

export default function LearningPage() {
  const { user } = useAuth();
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  });
  const [profile, setProfile] = useState(null);

  useEffect(() => { loadRecs(); }, []);

  async function loadRecs() {
    setLoading(true);
    try {
      const profRes = await api.get('/students/profile');
      setProfile(profRes.data);
      const { data } = await api.post('/ai/learning-recommendations', {
        skills: profRes.data.skills || [],
        interests: profRes.data.interests || [],
      });
      setRecs(data.recommendations || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  function toggleComplete(topic) {
    const next = completed.includes(topic) ? completed.filter(c => c !== topic) : [...completed, topic];
    setCompleted(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const pct = recs.length > 0 ? Math.round((completed.filter(c => recs.some(r => r.topic === c)).length / recs.length) * 100) : 0;

  return (
    <div style={{ background: '#F6F7FB', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0056D2 0%, #1E40AF 100%)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 42, height: 42, background: 'rgba(255,255,255,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🎓</div>
            <div>
              <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#fff' }}>Learning Hub</h1>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>AI-personalized courses based on your skills &amp; interests</p>
            </div>
          </div>
          {recs.length > 0 && (
            <div style={{ marginTop: '1.25rem', background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '0.9rem 1.25rem', maxWidth: 520 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>Learning Progress</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#93C5FD' }}>{pct}% complete</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 999, height: 6 }}>
                <div style={{ width: `${pct}%`, background: '#6EE7B7', borderRadius: 999, height: 6, transition: 'width 0.4s' }} />
              </div>
              <p style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.55)', marginTop: '0.4rem' }}>
                {completed.filter(c => recs.some(r => r.topic === c)).length} of {recs.length} courses marked complete
              </p>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {profile && (profile.skills?.length > 0 || profile.interests?.length > 0) && (
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: '#6B6B6B', fontWeight: 600 }}>Tailored for:</span>
            {(profile.skills || []).slice(0, 5).map(s => <span key={s} className="skill-tag">{s}</span>)}
            {(profile.interests || []).slice(0, 3).map(s => <span key={s} className="badge badge-blue">{s}</span>)}
          </div>
        )}

        {/* ── VR CLASSROOM BANNER ── */}
        <div style={{
          marginBottom: '1.75rem',
          background: 'linear-gradient(135deg, #0d1b3e 0%, #1e1060 50%, #0d1b3e 100%)',
          borderRadius: 16, padding: '1.5rem 2rem',
          display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap',
          border: '1px solid rgba(147,197,253,0.2)',
          boxShadow: '0 4px 24px rgba(0,86,210,0.25)',
        }}>
          <div style={{ fontSize: '3rem', flexShrink: 0 }}>🥽</div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <h3 style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem', margin: 0 }}>VR Immersive Classroom</h3>
              <span style={{ background: '#0056D2', color: '#93C5FD', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.55rem', borderRadius: 999 }}>NEW</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.84rem', margin: 0, lineHeight: 1.6 }}>
              Learn in a fully immersive 3D environment. Explore floating lesson panels, interactive hotspots — Cloud, ML, Web &amp; Data Science. VR headset supported.
            </p>
          </div>
          <button
            onClick={() => window.open('/vr-classroom.html', '_blank')}
            style={{
              background: 'linear-gradient(135deg, #0056D2, #7C3AED)',
              color: '#fff', border: 'none', borderRadius: 10, padding: '0.7rem 1.5rem',
              fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer', flexShrink: 0,
              boxShadow: '0 4px 14px rgba(0,86,210,0.4)',
            }}
          >
            🚀 Launch VR Classroom
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh', flexDirection: 'column', gap: '1rem' }}>
            <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3.5 }} />
            <p style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>Generating your personalized learning path...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {recs.map((rec, i) => {
              const done = completed.includes(rec.topic);
              const pColor = PLATFORM_COLORS[rec.platform] || PLATFORM_COLORS.default;
              const lColor = LEVEL_COLORS[rec.level] || '#6B6B6B';
              return (
                <div key={i} className="course-card" style={{ opacity: done ? 0.75 : 1, border: done ? '2px solid #00897B' : '2px solid transparent' }}>
                  <div className="course-card-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                      <span style={{ background: pColor + '18', color: pColor, fontSize: '0.73rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: 999 }}>{rec.platform}</span>
                      <span style={{ color: lColor, fontSize: '0.73rem', fontWeight: 700 }}>{rec.level}</span>
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.02rem', color: '#1C1D1F', marginBottom: '0.3rem' }}>{rec.topic}</h3>
                    <p style={{ fontSize: '0.83rem', color: '#6B6B6B', lineHeight: 1.6 }}>{rec.reason}</p>
                  </div>
                  <div className="course-card-footer" style={{ justifyContent: 'space-between' }}>
                    <a href={rec.url} target="_blank" rel="noopener noreferrer">
                      <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 1.1rem' }}>Start Learning →</button>
                    </a>
                    <button
                      onClick={() => toggleComplete(rec.topic)}
                      style={{ fontSize: '0.78rem', padding: '0.4rem 0.9rem', borderRadius: 8, border: `1.5px solid ${done ? '#00897B' : '#E0E5EC'}`, background: done ? '#E0F2F1' : '#fff', color: done ? '#00897B' : '#6B6B6B', cursor: 'pointer', fontWeight: 600 }}
                    >{done ? '✅ Completed' : '○ Mark Done'}</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && recs.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem', maxWidth: 480, margin: '0 auto' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Add skills to get recommendations</h3>
            <p style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>Go to your profile and add your skills and interests so our AI can suggest the best courses for you.</p>
          </div>
        )}
      </div>
    </div>
  );
}
