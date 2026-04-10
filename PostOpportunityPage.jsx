import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function PostOpportunityPage() {
  const [type, setType] = useState('internship');
  const [form, setForm] = useState({ title: '', description: '', required_skills: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await api.post(`/opportunities/${type}`, {
        title: form.title,
        description: form.description,
        required_skills: form.required_skills.split(',').map(s => s.trim()).filter(Boolean),
        ...(type === 'internship' && { location: form.location }),
      });
      navigate('/company/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post. Please try again.');
    } finally { setLoading(false); }
  }

  const skills = form.required_skills.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div style={{ background: '#F6F7FB', minHeight: 'calc(100vh - 64px)' }}>

      {/* Header */}
      <div style={{ background: '#0056D2', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#fff', marginBottom: '0.3rem' }}>Post an Opportunity</h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Reach thousands of motivated students looking for their next role</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>

        {/* Main form */}
        <div className="card">
          {/* Type selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="label" style={{ marginBottom: '0.7rem' }}>Opportunity Type</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[{ type: 'internship', icon: '💼', title: 'Internship', desc: 'Short/long-term work experience' }, { type: 'project', icon: '🚀', title: 'Project', desc: 'Collaboration on specific deliverable' }].map(opt => (
                <button key={opt.type} type="button" id={`post-type-${opt.type}`} onClick={() => setType(opt.type)} style={{
                  flex: 1, padding: '0.85rem 1rem', textAlign: 'left', borderRadius: 10, cursor: 'pointer', transition: 'all 0.18s',
                  border: `2px solid ${type === opt.type ? '#0056D2' : '#E8ECEF'}`,
                  background: type === opt.type ? '#E8F0FE' : '#fff',
                }}>
                  <div style={{ fontSize: '1.3rem', marginBottom: '0.3rem' }}>{opt.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: type === opt.type ? '#0056D2' : '#1C1D1F' }}>{opt.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6B6B6B' }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label className="label">Title <span style={{ color: '#D93025' }}>*</span></label>
              <input id="post-title" className="input" type="text" value={form.title} onChange={set('title')}
                placeholder={type === 'internship' ? 'e.g. Frontend Developer Intern – Summer 2026' : 'e.g. AI Chatbot Development Project'}
                required />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input" rows={4} value={form.description} onChange={set('description')}
                placeholder="Describe what the student will work on, technologies used, and what they will learn..."
                style={{ resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label className="label">Required Skills <span style={{ color: '#D93025' }}>*</span> <span style={{ color: '#9AA3B0', fontWeight: 400 }}>(comma-separated)</span></label>
              <input id="post-skills" className="input" type="text" value={form.required_skills} onChange={set('required_skills')}
                placeholder="React, Node.js, PostgreSQL, Docker, Git" required />
              {skills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                  {skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
                </div>
              )}
            </div>
            {type === 'internship' && (
              <div>
                <label className="label">Location</label>
                <input className="input" type="text" value={form.location} onChange={set('location')} placeholder="e.g. Bangalore / Remote / Hybrid" />
              </div>
            )}
            {error && <div className="alert-error">{error}</div>}
            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.35rem' }}>
              <button id="post-submit" className="btn-primary" type="submit" disabled={loading} style={{ fontSize: '0.95rem', padding: '0.75rem 1.75rem' }}>
                {loading ? <><span className="spinner" style={{ width: 15, height: 15, borderWidth: 2, borderTopColor: '#fff' }} /> Posting...</> : `Publish ${type === 'internship' ? 'Internship' : 'Project'} →`}
              </button>
              <button type="button" className="btn-ghost" onClick={() => navigate('/company/dashboard')}>Cancel</button>
            </div>
          </form>
        </div>

        {/* Tips sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1C1D1F', marginBottom: '0.85rem' }}>💡 Tips for better matches</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {[
                'Be specific with skills — "React 18" is better than "JavaScript".',
                'Write a clear description of day-to-day tasks.',
                'List 5–10 relevant skills for accurate AI matching.',
                'Mention the tech stack students will actually use.',
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.8rem', color: '#3D3D3D', lineHeight: 1.55 }}>
                  <span style={{ color: '#0056D2', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: '1.25rem', background: '#E8F0FE', border: '1px solid #C3D9F8' }}>
            <div style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>🎯</div>
            <h3 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0056D2', marginBottom: '0.4rem' }}>AI Matching</h3>
            <p style={{ fontSize: '0.78rem', color: '#3D3D3D', lineHeight: 1.6 }}>Students see a match % based on their skills vs. your requirements. Better descriptions → higher quality applicants.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
