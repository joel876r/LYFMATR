import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({ company_name: '', description: '', industry: '', location: '' });
  const [activeTab, setActiveTab] = useState('opportunities');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [students, setStudents] = useState([]);
  const [skillFilter, setSkillFilter] = useState('');

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [profRes, oppRes, studRes] = await Promise.all([
        api.get('/companies/profile'),
        api.get('/opportunities/mine'),
        api.get('/students/all'),
      ]);
      setProfile(profRes.data);
      setProfileForm({ company_name: profRes.data.company_name || '', description: profRes.data.description || '', industry: profRes.data.industry || '', location: profRes.data.location || '' });
      setOpportunities(oppRes.data);
      setStudents(studRes.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function saveProfile() {
    try {
      await api.put('/companies/profile', profileForm);
      setMsg('Profile updated!'); setEditMode(false); loadData();
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('Failed to save.'); }
  }

  async function deactivate(type, id) {
    if (!window.confirm('Deactivate this opportunity?')) return;
    try { await api.delete(`/opportunities/${type}/${id}`); loadData(); } catch { alert('Failed to deactivate.'); }
  }

  const active = opportunities.filter(o => o.is_active);
  const inactive = opportunities.filter(o => !o.is_active);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
      <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3.5 }} />
      <p style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ background: '#F6F7FB', minHeight: 'calc(100vh - 64px)' }}>

      {/* Header */}
      <div style={{ background: '#00897B', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#fff', marginBottom: '0.25rem' }}>
              {profile?.company_name || user.full_name} Dashboard
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem' }}>Manage your opportunities and attract top talent</p>
          </div>
          <Link to="/company/post">
            <button className="btn-primary" style={{ background: '#fff', color: '#00897B', fontWeight: 700 }}>+ Post New Opportunity</button>
          </Link>
        </div>
        {/* Stats */}
        <div style={{ maxWidth: 1180, margin: '1.25rem auto 0', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[{ label: 'Total Posted', value: opportunities.length, icon: '📋' }, { label: 'Active', value: active.length, icon: '✅' }, { label: 'Inactive', value: inactive.length, icon: '⏸️' }].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.65)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="page-container" style={{ paddingTop: '1.75rem' }}>
        <div className="tab-bar" style={{ overflowX: 'auto' }}>
          {[
            { id: 'opportunities', label: `📋 Opportunities (${opportunities.length})` },
            { id: 'talent', label: `👥 Talent Pool (${students.length})` },
            { id: 'profile', label: '🏢 Company Profile' },
          ].map(t => (
            <div key={t.id} className={`tab-item ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)} style={{ whiteSpace: 'nowrap' }}>{t.label}</div>
          ))}
        </div>

        {/* ── OPPORTUNITIES TAB ── */}
        {activeTab === 'opportunities' && (
          <div>
            {opportunities.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3.5rem', maxWidth: 480, margin: '0 auto' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No opportunities yet</h3>
                <p style={{ color: '#6B6B6B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Post your first internship or project to start finding the right students.</p>
                <Link to="/company/post"><button className="btn-primary">Post First Opportunity →</button></Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {opportunities.map(opp => (
                  <div key={`${opp.type}-${opp.id}`} className="card-flat" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ width: 44, height: 44, flexShrink: 0, background: opp.type === 'internship' ? '#E8F0FE' : '#FFF8E1', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                      {opp.type === 'internship' ? '💼' : '🚀'}
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1C1D1F' }}>{opp.title}</h3>
                        <span className={`badge ${opp.type === 'internship' ? 'badge-blue' : 'badge-yellow'}`}>{opp.type}</span>
                        <span className={`badge ${opp.is_active ? 'badge-green' : 'badge-gray'}`}>{opp.is_active ? 'Active' : 'Inactive'}</span>
                      </div>
                      {opp.location && <p style={{ fontSize: '0.78rem', color: '#9AA3B0', marginBottom: '0.4rem' }}>📍 {opp.location}</p>}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {(opp.required_skills || []).map(s => <span key={s} className="skill-tag">{s}</span>)}
                      </div>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      {opp.is_active && (
                        <button onClick={() => deactivate(opp.type, opp.id)} className="btn-ghost" style={{ fontSize: '0.78rem', color: '#D93025', borderColor: '#F5C2BF' }}>Deactivate</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TALENT POOL TAB ── */}
        {activeTab === 'talent' && (
          <div>
            <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input className="input" style={{ maxWidth: 340 }} placeholder="🔍 Filter by skill (e.g. React, Python, SQL...)" value={skillFilter} onChange={e => setSkillFilter(e.target.value)} />
              {skillFilter && <button className="btn-ghost" style={{ fontSize: '0.82rem' }} onClick={() => setSkillFilter('')}>Clear</button>}
              <span style={{ fontSize: '0.8rem', color: '#9AA3B0' }}>{students.filter(s => !skillFilter || s.skills.some(sk => sk.toLowerCase().includes(skillFilter.toLowerCase()))).length} students found</span>
            </div>
            {students.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem', maxWidth: 480, margin: '0 auto' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>👥</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No students yet</h3>
                <p style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>Students will appear here once they register and build their profiles.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.1rem' }}>
                {students
                  .filter(s => !skillFilter || s.skills.some(sk => sk.toLowerCase().includes(skillFilter.toLowerCase())))
                  .map(s => (
                    <div key={s.user_id} className="card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E8F0FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#0056D2', fontSize: '0.95rem', flexShrink: 0 }}>
                          {s.full_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1C1D1F' }}>{s.full_name || 'Anonymous'}</div>
                          <div style={{ fontSize: '0.76rem', color: '#9AA3B0' }}>{s.education || 'Education not specified'}</div>
                        </div>
                        {(s.validated_skills || []).length > 0 && (
                          <span className="badge badge-green" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>🏅 {s.validated_skills.length} validated</span>
                        )}
                      </div>
                      {s.bio && <p style={{ fontSize: '0.82rem', color: '#6B6B6B', lineHeight: 1.6, marginBottom: '0.8rem' }}>{s.bio.slice(0, 100)}{s.bio.length > 100 ? '...' : ''}</p>}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {(s.skills || []).slice(0, 6).map(sk => (
                          <span key={sk} className={`skill-tag ${skillFilter && sk.toLowerCase().includes(skillFilter.toLowerCase()) ? 'matched' : ''}`}>{sk}</span>
                        ))}
                        {(s.skills || []).length > 6 && <span className="badge badge-gray">+{s.skills.length - 6} more</span>}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: 680 }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1C1D1F' }}>Company Profile</h2>
                <button className="btn-ghost" onClick={() => { setEditMode(!editMode); setMsg(''); }} style={{ fontSize: '0.82rem' }}>{editMode ? 'Cancel' : '✏️ Edit'}</button>
              </div>
              {msg && <div className={msg.includes('Failed') ? 'alert-error' : 'alert-success'} style={{ marginBottom: '1rem' }}>{msg}</div>}
              {editMode ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[['company_name', 'Company Name', 'e.g. Acme Technologies'], ['description', 'About Company', 'What does your company do?'], ['industry', 'Industry', 'Technology, Finance, Healthcare...'], ['location', 'Location', 'Mumbai, India / Remote']].map(([key, label, ph]) => (
                    <div key={key}>
                      <label className="label">{label}</label>
                      <input className="input" value={profileForm[key]} onChange={e => setProfileForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} />
                    </div>
                  ))}
                  <button className="btn-primary" onClick={saveProfile}>Save Profile</button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  {[['Company Name', profile?.company_name], ['Industry', profile?.industry], ['Location', profile?.location], ['About', profile?.description]].map(([k, v]) => (
                    <div key={k}><div className="label">{k}</div><div style={{ color: v ? '#1C1D1F' : '#9AA3B0', fontSize: '0.92rem', marginTop: '0.2rem' }}>{v || 'Not set'}</div></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
