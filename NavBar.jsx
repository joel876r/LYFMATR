import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

  useEffect(() => {
    if (user?.user_type === 'student') {
      api.get(`/matching/opportunities/${user.id}`).then(res => {
        const top = (res.data || []).filter(o => o.matchScore >= 50).slice(0, 5);
        setNotifications(top);
      }).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    function handleClick(e) { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;
  const linkStyle = (path) => ({
    fontSize: '0.88rem', fontWeight: 600,
    color: isActive(path) ? '#0056D2' : '#3D3D3D',
    textDecoration: 'none', padding: '0.4rem 0.1rem',
    borderBottom: isActive(path) ? '2px solid #0056D2' : '2px solid transparent',
    transition: 'all 0.15s', whiteSpace: 'nowrap',
  });

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #E8ECEF', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#0056D2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🎓</div>
            <div>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1.05rem', color: '#0056D2', lineHeight: 1 }}>EduBridge</div>
              <div style={{ fontSize: '0.62rem', color: '#9AA3B0', fontWeight: 500, letterSpacing: '0.05em', lineHeight: 1 }}>CAREER PLATFORM</div>
            </div>
          </div>
        </Link>

        {/* Center nav links */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.4rem', overflowX: 'auto' }}>
            {user.user_type === 'student' ? (
              <>
                <Link to="/student/dashboard" style={linkStyle('/student/dashboard')}>Dashboard</Link>
                <Link to="/student/skill-gap" style={linkStyle('/student/skill-gap')}>AI Analyzer</Link>
                <Link to="/student/learning" style={linkStyle('/student/learning')}>Learning</Link>
                <Link to="/student/assessment" style={linkStyle('/student/assessment')}>Assessments</Link>
                <Link to="/student/mentorship" style={linkStyle('/student/mentorship')}>Mentorship</Link>
              </>
            ) : (
              <>
                <Link to="/company/dashboard" style={linkStyle('/company/dashboard')}>Dashboard</Link>
                <Link to="/company/post" style={linkStyle('/company/post')}>Post Opportunity</Link>
              </>
            )}
          </div>
        )}

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
          {!user ? (
            <>
              <Link to="/login" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#3D3D3D', textDecoration: 'none' }}>Log In</Link>
              <Link to="/register"><button className="btn-primary" style={{ padding: '0.48rem 1.15rem', fontSize: '0.86rem' }}>Join Free</button></Link>
            </>
          ) : (
            <>
              {/* Notification Bell — student only */}
              {user.user_type === 'student' && (
                <div ref={notifRef} style={{ position: 'relative' }}>
                  <button onClick={() => setNotifOpen(o => !o)}
                    style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', padding: '0.2rem 0.4rem', borderRadius: 8 }}>
                    🔔
                    {notifications.length > 0 && (
                      <span style={{ position: 'absolute', top: 0, right: 0, background: '#D93025', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: '0.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div style={{ position: 'absolute', right: 0, top: '120%', width: 320, background: '#fff', borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: '1px solid #E8ECEF', zIndex: 200, overflow: 'hidden' }}>
                      <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #F0F0F0', fontWeight: 700, fontSize: '0.88rem', color: '#1C1D1F' }}>
                        🔔 Matched Opportunities
                      </div>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '1.5rem', textAlign: 'center', color: '#9AA3B0', fontSize: '0.85rem' }}>No matches yet. Add skills to your profile!</div>
                      ) : (
                        notifications.map((n, i) => (
                          <Link key={i} to="/student/dashboard" onClick={() => setNotifOpen(false)} style={{ textDecoration: 'none' }}>
                            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #F6F7FB', cursor: 'pointer' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#F6F7FB'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1C1D1F' }}>{n.title}</div>
                              <div style={{ fontSize: '0.75rem', color: '#9AA3B0', marginTop: '0.1rem' }}>{n.company_name} · {n.matchScore}% match</div>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: user.user_type === 'student' ? '#E8F0FE' : '#E0F2F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: user.user_type === 'student' ? '#0056D2' : '#00897B' }}>
                  {user.full_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1C1D1F', lineHeight: 1.2 }}>{user.full_name?.split(' ')[0]}</div>
                  <div style={{ fontSize: '0.68rem', color: '#9AA3B0', textTransform: 'capitalize' }}>{user.user_type}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="btn-ghost" style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}>Log Out</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
