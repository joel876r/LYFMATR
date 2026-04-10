import React, { useState, useEffect } from 'react';
import api from '../api';

const COMMON_SKILLS = ['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Machine Learning', 'Docker', 'AWS', 'Java', 'Data Analysis', 'TypeScript', 'MongoDB'];

export default function AssessmentPage() {
  const [skill, setSkill] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [badgeSaved, setBadgeSaved] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/students/profile').then(r => setProfile(r.data)).catch(() => {});
  }, []);

  const activeSkill = customSkill.trim() || skill;

  async function startQuiz() {
    if (!activeSkill) return;
    setLoading(true); setError(''); setQuestions([]); setAnswers({}); setSubmitted(false); setBadgeSaved(false);
    try {
      const { data } = await api.post('/ai/generate-quiz', { skill: activeSkill });
      setQuestions(data.questions || []);
    } catch { setError('Failed to generate quiz. Please try again.'); }
    finally { setLoading(false); }
  }

  function select(qIdx, optIdx) {
    if (submitted) return;
    setAnswers(a => ({ ...a, [qIdx]: optIdx }));
  }

  const score = submitted
    ? questions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0)
    : 0;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const passed = pct >= 60;

  async function saveValidation() {
    setSaving(true);
    try {
      await api.put('/students/validate-skill', { skill: activeSkill, score: pct });
      setBadgeSaved(true);
    } catch { setError('Failed to save badge.'); }
    finally { setSaving(false); }
  }

  const validatedSkillNames = (profile?.validated_skills || []).map(v => v.skill);

  return (
    <div style={{ background: '#F6F7FB', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 42, height: 42, background: 'rgba(255,255,255,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🧪</div>
          <div>
            <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#fff' }}>Skill Assessments</h1>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>Validate your skills with AI-generated quizzes · Earn profile badges</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Validated badges */}
        {validatedSkillNames.length > 0 && (
          <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #7C3AED' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#7C3AED', marginBottom: '0.75rem' }}>🏆 Your Validated Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(profile.validated_skills || []).map(v => (
                <div key={v.skill} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#F3F0FF', border: '1.5px solid #7C3AED', borderRadius: 999, padding: '0.28rem 0.85rem' }}>
                  <span style={{ color: '#7C3AED', fontWeight: 700, fontSize: '0.8rem' }}>✓ {v.skill}</span>
                  <span style={{ fontSize: '0.72rem', color: '#9AA3B0' }}>{v.score}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skill selector */}
        {!questions.length && !loading && (
          <div className="card">
            <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1C1D1F', marginBottom: '1.25rem' }}>Choose a skill to assess</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {COMMON_SKILLS.map(s => (
                <button key={s} onClick={() => { setSkill(s); setCustomSkill(''); }}
                  style={{ padding: '0.4rem 1rem', borderRadius: 999, border: `2px solid ${skill === s && !customSkill ? '#7C3AED' : '#E0E5EC'}`, background: skill === s && !customSkill ? '#F3F0FF' : '#fff', color: skill === s && !customSkill ? '#7C3AED' : '#3D3D3D', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                  {validatedSkillNames.includes(s) ? '✓ ' : ''}{s}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <input className="input" style={{ flex: 1 }} placeholder="Or type any skill (e.g. Kubernetes, Rust, Figma...)"
                value={customSkill} onChange={e => { setCustomSkill(e.target.value); setSkill(''); }} />
            </div>
            {error && <div className="alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}
            <button className="btn-primary" style={{ background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', fontSize: '0.95rem', padding: '0.75rem 2rem' }}
              onClick={startQuiz} disabled={!activeSkill}>
              🧪 Start Assessment: {activeSkill || '—'}
            </button>
          </div>
        )}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh', flexDirection: 'column', gap: '1rem' }}>
            <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3.5 }} />
            <p style={{ color: '#6B6B6B' }}>Generating your {activeSkill} assessment...</p>
          </div>
        )}

        {/* Quiz */}
        {questions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1C1D1F' }}>
                <span style={{ color: '#7C3AED' }}>{activeSkill}</span> Assessment
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#9AA3B0' }}>{Object.keys(answers).length}/{questions.length} answered</span>
            </div>

            {questions.map((q, qi) => (
              <div key={qi} className="card" style={{ borderLeft: submitted ? `4px solid ${answers[qi] === q.answer ? '#00897B' : '#D93025'}` : '4px solid #E8ECEF' }}>
                <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1C1D1F', marginBottom: '0.9rem', lineHeight: 1.5 }}>
                  <span style={{ color: '#7C3AED', fontWeight: 800 }}>Q{qi + 1}.</span> {q.question}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {q.options.map((opt, oi) => {
                    let bg = '#F6F7FB', border = '#E0E5EC', color = '#3D3D3D';
                    if (submitted) {
                      if (oi === q.answer) { bg = '#E0F2F1'; border = '#00897B'; color = '#00897B'; }
                      else if (answers[qi] === oi) { bg = '#FDECEA'; border = '#D93025'; color = '#D93025'; }
                    } else if (answers[qi] === oi) { bg = '#F3F0FF'; border = '#7C3AED'; color = '#7C3AED'; }
                    return (
                      <button key={oi} onClick={() => select(qi, oi)}
                        style={{ textAlign: 'left', padding: '0.65rem 1rem', borderRadius: 8, border: `2px solid ${border}`, background: bg, color, cursor: submitted ? 'default' : 'pointer', fontWeight: answers[qi] === oi ? 700 : 400, fontSize: '0.88rem', transition: 'all 0.15s' }}>
                        <span style={{ fontWeight: 700, marginRight: '0.5rem' }}>{String.fromCharCode(65 + oi)}.</span>{opt}
                        {submitted && oi === q.answer && <span style={{ marginLeft: '0.5rem' }}>✓</span>}
                        {submitted && answers[qi] === oi && oi !== q.answer && <span style={{ marginLeft: '0.5rem' }}>✗</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {!submitted ? (
              <button className="btn-primary" style={{ background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', alignSelf: 'flex-start', padding: '0.75rem 2rem' }}
                onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < questions.length}>
                Submit Assessment →
              </button>
            ) : (
              <div className="card" style={{ borderLeft: `4px solid ${passed ? '#00897B' : '#D93025'}`, background: passed ? '#F0FFF4' : '#FFF5F5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: passed ? '#00897B' : '#D93025', fontFamily: 'Poppins,sans-serif', lineHeight: 1 }}>{pct}%</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '0.3rem' }}>{passed ? '🎉 Passed!' : '📚 Keep Practicing'}</div>
                    <div style={{ fontSize: '0.85rem', color: '#6B6B6B', marginTop: '0.2rem' }}>{score}/{questions.length} correct</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {passed && !badgeSaved && (
                      <button className="btn-primary" style={{ background: 'linear-gradient(135deg,#7C3AED,#4F46E5)' }} onClick={saveValidation} disabled={saving}>
                        {saving ? 'Saving...' : '🏅 Save Skill Badge'}
                      </button>
                    )}
                    {badgeSaved && <div className="badge badge-green" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>✓ Badge saved to profile!</div>}
                    <button className="btn-ghost" onClick={() => { setQuestions([]); setAnswers({}); setSubmitted(false); setBadgeSaved(false); }}>Try Another Skill</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
