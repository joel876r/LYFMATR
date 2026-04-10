import React, { useState, useEffect } from 'react';
import api from '../api';

const EXAMPLES = [
  { label: 'Data Science', student: 'Python, SQL, Excel, Statistics', required: 'Python, TensorFlow, AWS, Docker, Apache Spark' },
  { label: 'Frontend Dev', student: 'HTML, CSS, JavaScript, Bootstrap', required: 'React, TypeScript, GraphQL, Jest, CI/CD' },
  { label: 'Backend Dev', student: 'Node.js, Express, MongoDB, REST API', required: 'Go, Kubernetes, Redis, PostgreSQL, gRPC' },
  { label: 'Cloud Eng.', student: 'Linux, Python, Bash', required: 'AWS, Terraform, Kubernetes, Docker, CI/CD, Ansible' },
];

export default function SkillGapAnalyzer() {
  const [studentSkills, setStudentSkills] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Auto-populate skills from student profile on mount
  useEffect(() => {
    api.get('/students/profile').then(res => {
      const skills = res.data?.skills || [];
      if (skills.length > 0) {
        setStudentSkills(skills.join(', '));
        setProfileLoaded(true);
      }
    }).catch(() => {});
  }, []);

  const handleAnalyze = async () => {
    if (!studentSkills.trim() || !requiredSkills.trim()) return;
    setLoading(true); setError(''); setAnalysis(null);
    try {
      const { data } = await api.post('/ai/skill-gap', {
        studentSkills: studentSkills.split(',').map(s => s.trim()).filter(Boolean),
        requiredSkills: requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      });
      setAnalysis(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please check your connection and try again.');
    } finally { setLoading(false); }
  };

  const inputSkills = studentSkills.split(',').map(s => s.trim()).filter(Boolean);
  const targetSkills = requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
  const matched = inputSkills.filter(s => targetSkills.some(t => t.toLowerCase() === s.toLowerCase()));
  const pct = targetSkills.length > 0 ? Math.round((matched.length / targetSkills.length) * 100) : 0;

  return (
    <div style={{ background: '#F6F7FB', minHeight: 'calc(100vh - 64px)' }}>

      {/* Header */}
      <div style={{ background: '#0056D2', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🤖</div>
            <div>
              <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#fff' }}>AI Skill Gap Analyzer</h1>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>Powered by Google Gemini · Instant analysis · Personalized learning paths</p>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container-sm" style={{ paddingTop: '1.75rem' }}>

        {/* Quick example chips */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#6B6B6B' }}>Try example:</span>
          {EXAMPLES.map(ex => (
            <button key={ex.label} className="badge badge-blue" style={{ cursor: 'pointer', border: '1px solid #C3D9F8', fontSize: '0.78rem', padding: '0.28rem 0.75rem' }}
              onClick={() => { setStudentSkills(ex.student); setRequiredSkills(ex.required); setAnalysis(null); }}>
              {ex.label}
            </button>
          ))}
        </div>

        {/* Input card */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <label className="label" style={{ margin: 0 }}>Your Current Skills</label>
                {profileLoaded && (
                  <span style={{ fontSize: '0.7rem', background: '#E0F2F1', color: '#00897B', fontWeight: 700, padding: '0.15rem 0.55rem', borderRadius: 999 }}>
                    ✓ From your profile
                  </span>
                )}
              </div>
              <textarea className="input" rows={4} value={studentSkills}
                onChange={e => { setStudentSkills(e.target.value); setProfileLoaded(false); }}
                placeholder="e.g. Python, SQL, React, Machine Learning..."
                style={{ resize: 'vertical', fontFamily: 'inherit' }} />
              {inputSkills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.5rem' }}>
                  {inputSkills.map(s => <span key={s} className="skill-tag">{s}</span>)}
                </div>
              )}
            </div>
            <div>
              <label className="label">Required Skills for Target Role</label>
              <textarea className="input" rows={4} value={requiredSkills}
                onChange={e => setRequiredSkills(e.target.value)}
                placeholder="e.g. Docker, AWS, Kubernetes, TensorFlow..."
                style={{ resize: 'vertical', fontFamily: 'inherit' }} />
              {targetSkills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.5rem' }}>
                  {targetSkills.map(s => <span key={s} className={matched.some(m => m.toLowerCase() === s.toLowerCase()) ? 'skill-tag matched' : 'skill-tag missing'}>{s}</span>)}
                </div>
              )}
            </div>
          </div>

          {/* Live preview bar */}
          {targetSkills.length > 0 && inputSkills.length > 0 && (
            <div style={{ background: '#F6F7FB', borderRadius: 8, padding: '0.85rem 1rem', marginBottom: '1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#3D3D3D' }}>Current match preview</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: pct >= 60 ? '#00897B' : pct >= 30 ? '#B35B00' : '#D93025' }}>{pct}%</span>
              </div>
              <div className="progress-bg"><div className={pct >= 60 ? 'progress-fill-green' : pct >= 30 ? 'progress-fill-yellow' : 'progress-fill'} style={{ width: `${pct}%` }} /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.76rem', color: '#6B6B6B' }}>
                <span>✅ {matched.length} matched</span>
                <span>⚠️ {targetSkills.length - matched.length} missing</span>
              </div>
            </div>
          )}

          <button id="analyze-btn" className="btn-primary" onClick={handleAnalyze}
            disabled={loading || !studentSkills.trim() || !requiredSkills.trim()}
            style={{ fontSize: '0.95rem', padding: '0.75rem 2rem' }}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: '#fff' }} /> Analyzing with Gemini AI...</> : '✨ Analyze Skill Gap'}
          </button>
        </div>

        {error && <div className="alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

        {/* Result */}
        {analysis && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Summary */}
            <div className="card" style={{ borderLeft: `4px solid #0056D2` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <div style={{ width: 32, height: 32, background: '#E8F0FE', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>📊</div>
                <h3 style={{ fontWeight: 700, fontSize: '0.97rem', color: '#0056D2' }}>Analysis Summary</h3>
              </div>
              <p style={{ color: '#3D3D3D', lineHeight: 1.75, fontSize: '0.92rem' }}>{analysis.analysis}</p>
            </div>

            {/* Missing skills */}
            {(analysis.missing_skills || []).length > 0 && (
              <div className="card" style={{ borderLeft: '4px solid #D93025' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: 32, height: 32, background: '#FDECEA', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>⚠️</div>
                  <h3 style={{ fontWeight: 700, fontSize: '0.97rem', color: '#D93025' }}>Skills to Develop ({analysis.missing_skills.length})</h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {analysis.missing_skills.map(skill => (
                    <span key={skill} className="skill-tag missing" style={{ fontSize: '0.85rem', padding: '0.28rem 0.75rem' }}>{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Learning path */}
            {(analysis.learning_path || []).length > 0 && (
              <div className="card" style={{ borderLeft: '4px solid #00897B' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <div style={{ width: 32, height: 32, background: '#E0F2F1', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🗺️</div>
                  <h3 style={{ fontWeight: 700, fontSize: '0.97rem', color: '#00897B' }}>Recommended Learning Path</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {analysis.learning_path.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start', padding: '0.75rem', background: '#F6F7FB', borderRadius: 8 }}>
                      <div style={{ minWidth: 28, height: 28, borderRadius: '50%', background: '#0056D2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>{i + 1}</div>
                      <span style={{ color: '#3D3D3D', lineHeight: 1.65, fontSize: '0.88rem', paddingTop: '0.25rem' }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
