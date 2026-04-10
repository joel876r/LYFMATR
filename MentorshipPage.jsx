import React, { useState, useEffect } from 'react';
import api from '../api';

const MENTORS = [
  { name: 'Dr. Arjun Kapoor', domain: 'Machine Learning', role: 'Senior Data Scientist @ Google', exp: '12 years', avatar: 'A', color: '#0056D2', skills: ['Python', 'TensorFlow', 'Deep Learning', 'MLOps'] },
  { name: 'Sneha Reddy', domain: 'Full-Stack Development', role: 'Engineering Manager @ Flipkart', exp: '9 years', avatar: 'S', color: '#7C3AED', skills: ['React', 'Node.js', 'System Design', 'AWS'] },
  { name: 'Vikram Nair', domain: 'Product Management', role: 'Director of Product @ Swiggy', exp: '11 years', avatar: 'V', color: '#D97706', skills: ['Product Strategy', 'Agile', 'User Research', 'OKRs'] },
  { name: 'Priya Menon', domain: 'UI/UX Design', role: 'Principal Designer @ Zomato', exp: '8 years', avatar: 'P', color: '#059669', skills: ['Figma', 'Design Systems', 'User Testing', 'Prototyping'] },
  { name: 'Rahul Sharma', domain: 'Cloud & DevOps', role: 'Cloud Architect @ Microsoft', exp: '10 years', avatar: 'R', color: '#DC2626', skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'] },
  { name: 'Ananya Singh', domain: 'Data Analytics', role: 'Analytics Lead @ Razorpay', exp: '7 years', avatar: 'N', color: '#0891B2', skills: ['SQL', 'Python', 'Tableau', 'Business Intelligence'] },
];

export default function MentorshipPage() {
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [advice, setAdvice] = useState('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [profile, setProfile] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.get('/students/profile').then(r => setProfile(r.data)).catch(() => {});
  }, []);

  async function requestGuidance(mentor) {
    setSelectedMentor(mentor);
    setAdvice('');
    setLoadingAdvice(true);
    try {
      const studentSkills = (profile?.skills || []).join(', ') || 'various technical skills';
      const studentInterests = (profile?.interests || []).join(', ') || 'software development';
      const { data } = await api.post('/ai/skill-gap', {
        studentSkills: profile?.skills || ['programming'],
        requiredSkills: mentor.skills,
      });
      // Use the analysis as personalized advice
      const adviceText = `As ${mentor.name} (${mentor.role}), here's my guidance for you:\n\n${data.analysis}\n\nLearning Path:\n${(data.learning_path || []).join('\n')}`;
      setAdvice(adviceText);
    } catch {
      setAdvice(`Great to connect! Based on your profile, I'd recommend focusing on building strong fundamentals in ${mentor.domain}. Start with small projects, contribute to open source, and never stop learning. The industry rewards those who are curious and consistent. Feel free to reach out anytime!`);
    }
    setLoadingAdvice(false);
  }

  const filtered = MENTORS.filter(m =>
    !filter || m.domain.toLowerCase().includes(filter.toLowerCase()) || m.skills.some(s => s.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div style={{ background: '#F6F7FB', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #059669 0%, #0D9488 100%)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 42, height: 42, background: 'rgba(255,255,255,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🤝</div>
          <div>
            <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#fff' }}>Mentorship Hub</h1>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>Connect with industry experts · Get AI-powered personalized career guidance</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Filter */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input className="input" style={{ maxWidth: 320 }} placeholder="🔍 Filter by domain or skill..." value={filter} onChange={e => setFilter(e.target.value)} />
          {filter && <button className="btn-ghost" style={{ fontSize: '0.82rem' }} onClick={() => setFilter('')}>Clear</button>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(mentor => (
            <div key={mentor.name} className="course-card" style={{ border: selectedMentor?.name === mentor.name ? `2px solid ${mentor.color}` : '2px solid transparent' }}>
              <div className="course-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '0.9rem' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: mentor.color + '18', border: `2px solid ${mentor.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 800, color: mentor.color, flexShrink: 0 }}>
                    {mentor.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.97rem', color: '#1C1D1F' }}>{mentor.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#9AA3B0' }}>{mentor.role}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ background: mentor.color + '15', color: mentor.color, fontSize: '0.73rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: 999 }}>{mentor.domain}</span>
                  <span className="badge badge-gray">{mentor.exp} exp</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {mentor.skills.map(s => <span key={s} className="skill-tag" style={{ fontSize: '0.74rem' }}>{s}</span>)}
                </div>
              </div>
              <div className="course-card-footer">
                <button className="btn-primary" style={{ background: mentor.color, fontSize: '0.82rem' }} onClick={() => requestGuidance(mentor)}>
                  💬 Request Guidance
                </button>
                <span style={{ fontSize: '0.75rem', color: '#9AA3B0' }}>AI-powered advice</span>
              </div>
            </div>
          ))}
        </div>

        {/* Advice Panel */}
        {selectedMentor && (
          <div className="card" style={{ marginTop: '2rem', borderLeft: `4px solid ${selectedMentor.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: selectedMentor.color + '18', border: `2px solid ${selectedMentor.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800, color: selectedMentor.color }}>
                {selectedMentor.avatar}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#1C1D1F' }}>Guidance from {selectedMentor.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#9AA3B0' }}>{selectedMentor.role} · Personalized for your profile</div>
              </div>
            </div>
            {loadingAdvice ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem' }}>
                <div className="spinner" style={{ width: 22, height: 22, borderWidth: 2.5 }} />
                <span style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>Generating personalized career advice...</span>
              </div>
            ) : (
              <div style={{ background: '#F6F7FB', borderRadius: 10, padding: '1.25rem', whiteSpace: 'pre-line', fontSize: '0.92rem', color: '#3D3D3D', lineHeight: 1.8 }}>
                {advice}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
