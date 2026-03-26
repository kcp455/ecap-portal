import React, { useState, useEffect, useCallback } from 'react';
import Icon from './components/Icon.jsx';
import logger from './utils/logger.js';
import { light, dark as darkTheme } from './utils/theme.js';
import { INITIAL_STUDENTS, ADMIN_USER, PUBLIC_SUBJECTS } from './data/seedData.js';

// ═══════════════════════════════════════════════════════════════
//  ECAP — Educational Content & Academic Portal
// ═══════════════════════════════════════════════════════════════

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [toast, setToast] = useState(null);

  const t = isDark ? darkTheme : light;

  const showToast = useCallback((msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    logger.log('SYSTEM_START', 'SYSTEM', 'ECAP Portal initialized');
  }, []);

  // ─── Auth handlers ────────────────────────────────────────────
  const handleLogin = (email, password) => {
    if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
      setUser({ ...ADMIN_USER, name: 'Administrator' });
      logger.log('LOGIN', email, 'Admin login successful');
      setPage('admin-dashboard');
      showToast('Welcome, Administrator', 'success');
      return true;
    }
    const student = students.find((s) => s.email === email && s.password === password);
    if (student) {
      setUser({ ...student, role: 'student' });
      logger.log('LOGIN', email, `Student login: ${student.name}`);
      setPage('dashboard');
      showToast(`Welcome, ${student.name}`, 'success');
      return true;
    }
    logger.log('LOGIN_FAILED', email, 'Invalid credentials');
    return false;
  };

  const handleLogout = () => {
    logger.log('LOGOUT', user?.email, `${user?.name} logged out`);
    setUser(null);
    setPage('home');
    showToast('Logged out successfully');
  };

  const handlePasswordReset = (oldPw, newPw) => {
    if (user?.password !== oldPw) return false;
    setStudents((prev) => prev.map((s) => (s.id === user.id ? { ...s, password: newPw } : s)));
    setUser((prev) => ({ ...prev, password: newPw }));
    logger.log('PASSWORD_RESET', user.email, 'Password changed successfully');
    showToast('Password updated', 'success');
    return true;
  };

  const handleBulkUpload = (data) => {
    const newStudents = data.map((row, i) => ({
      id: `STU${String(students.length + i + 1).padStart(3, '0')}`,
      name: row[0] || '', email: row[1] || '', password: 'pass123',
      department: row[2] || '', year: parseInt(row[3]) || 1,
      cgpa: parseFloat(row[4]) || 0, attendance: parseFloat(row[5]) || 0,
      feeDue: parseFloat(row[6]) || 0, qualification: row[7] || '',
      achievements: [], photo: '',
    }));
    setStudents((prev) => [...prev, ...newStudents]);
    logger.log('BULK_UPLOAD', user?.email, `${newStudents.length} students added via CSV`);
    showToast(`${newStudents.length} students added`, 'success');
  };

  const handleAddAchievement = (text) => {
    setStudents((prev) => prev.map((s) => (s.id === user.id ? { ...s, achievements: [...s.achievements, text] } : s)));
    setUser((prev) => ({ ...prev, achievements: [...prev.achievements, text] }));
    logger.log('ACHIEVEMENT_ADDED', user.email, text);
    showToast('Achievement added', 'success');
  };

  const handleModifyStudent = (id, field, value) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
    if (user?.id === id) setUser((prev) => ({ ...prev, [field]: value }));
    logger.log('DATA_MODIFIED', user?.email, `${id}: ${field} updated`);
  };

  // ─── Shared styles ────────────────────────────────────────────
  const s = {
    container: { maxWidth: 1080, margin: '0 auto', padding: '40px 24px' },
    heading: (size = 32) => ({ fontSize: size, fontWeight: 700, letterSpacing: '-0.02em', color: t.text, margin: 0 }),
    card: { background: t.card, borderRadius: 16, border: `0.5px solid ${t.border}`, padding: 24, transition: 'background 0.3s' },
    input: { width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${t.border}`, background: isDark ? t.bg3 : '#fff', color: t.text, fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' },
    label: { fontSize: 13, fontWeight: 600, color: t.textSoft, marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' },
    link: { color: t.link, textDecoration: 'none', cursor: 'pointer', fontWeight: 500 },
    btn: (v = 'primary') => ({
      padding: v === 'small' ? '6px 14px' : '10px 22px', borderRadius: 8,
      border: v === 'outline' ? `1px solid ${t.border}` : 'none',
      background: v === 'primary' ? t.accent : v === 'outline' ? 'transparent' : t.bg3,
      color: v === 'primary' ? '#fff' : t.text, fontSize: v === 'small' ? 13 : 14,
      fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.2s',
      display: 'inline-flex', alignItems: 'center', gap: 6,
    }),
  };

  // ═════════════════════════════════════════════════════════════
  //  NAVBAR
  // ═════════════════════════════════════════════════════════════
  const Nav = () => (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100, padding: '0 24px',
      background: t.navBg, backdropFilter: 'saturate(180%) blur(20px)',
      borderBottom: `0.5px solid ${t.border}`,
    }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span
            style={{ fontWeight: 700, fontSize: 18, cursor: 'pointer', letterSpacing: '-0.02em', color: t.text }}
            onClick={() => setPage(user?.role === 'admin' ? 'admin-dashboard' : user ? 'dashboard' : 'home')}
          >
            ECAP
          </span>
          <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
            <span style={{ ...s.link, color: t.textSoft }} onClick={() => setPage('subjects')}>Subjects</span>
            <span style={{ ...s.link, color: t.textSoft }} onClick={() => setPage('materials')}>Materials</span>
            {user && <span style={{ ...s.link, color: t.textSoft }} onClick={() => setPage('dashboard')}>Dashboard</span>}
            {user?.role === 'admin' && <span style={{ ...s.link, color: t.textSoft }} onClick={() => setPage('admin-dashboard')}>Admin</span>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => { setIsDark(!isDark); logger.log('THEME_TOGGLE', user?.email || 'GUEST', isDark ? 'Light mode' : 'Dark mode'); }}
            style={{ ...s.btn('outline'), padding: '6px 8px', borderRadius: '50%' }}
            aria-label="Toggle dark mode"
          >
            <Icon name={isDark ? 'sun' : 'moon'} size={16} />
          </button>
          {user ? (
            <>
              <span style={{ fontSize: 13, color: t.textSoft }}>{user.name}</span>
              <button onClick={handleLogout} style={s.btn('outline')} aria-label="Logout"><Icon name="logout" size={14} /> Logout</button>
            </>
          ) : (
            <button onClick={() => setPage('login')} style={s.btn('primary')}>Sign In</button>
          )}
        </div>
      </div>
    </nav>
  );

  // ═════════════════════════════════════════════════════════════
  //  HOME
  // ═════════════════════════════════════════════════════════════
  const HomePage = () => (
    <div>
      <div style={{ ...s.container, textAlign: 'center', paddingTop: 80, paddingBottom: 80 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: t.accent, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
          Educational Content & Academic Portal
        </p>
        <h1 style={{ ...s.heading(48), marginBottom: 16 }}>Learn without limits.</h1>
        <p style={{ fontSize: 19, color: t.textSoft, maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.5 }}>
          Access course materials, track your academic progress, and manage your educational journey — all in one place.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setPage('subjects')} style={s.btn('primary')}>Browse Subjects</button>
          <button onClick={() => setPage('login')} style={s.btn('outline')}>Student Login</button>
        </div>
      </div>
      <div style={{ ...s.container, paddingTop: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {[
            { icon: 'book',  title: 'Open Courseware',    desc: 'Browse subjects and download materials without an account. Learning should be accessible to everyone.' },
            { icon: 'chart', title: 'Academic Tracking',  desc: 'Students can view their CGPA, attendance, fee status, and qualifications through a secure dashboard.' },
            { icon: 'award', title: 'Achievements',       desc: 'Upload certificates and track accomplishments. Build your academic portfolio in one place.' },
          ].map((f, i) => (
            <div key={i} style={s.card}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: t.bg2, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: t.accent }}>
                <Icon name={f.icon} size={20} />
              </div>
              <h3 style={{ ...s.heading(19), marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: t.textSoft, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <footer style={{ background: t.bg2, marginTop: 60, padding: '40px 24px', textAlign: 'center', borderTop: `0.5px solid ${t.border}` }}>
        <p style={{ fontSize: 13, color: t.textSoft, margin: 0 }}>ECAP Portal — Built for accessible education.</p>
        <p style={{ fontSize: 12, color: t.textSoft, marginTop: 4 }}>
          Demo: <span style={{ color: t.link }}>aarav@ecap.edu</span> / pass123 · Admin: <span style={{ color: t.link }}>admin@ecap.edu</span> / admin123
        </p>
      </footer>
    </div>
  );

  // ═════════════════════════════════════════════════════════════
  //  LOGIN
  // ═════════════════════════════════════════════════════════════
  const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [error, setError] = useState('');
    const submit = (e) => { e.preventDefault(); if (!handleLogin(email, pw)) { setError('Invalid email or password'); showToast('Login failed', 'error'); } };
    return (
      <div style={{ ...s.container, maxWidth: 420, paddingTop: 80 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: t.bg2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: t.accent }}><Icon name="lock" size={24} /></div>
          <h2 style={s.heading(28)}>Sign in to ECAP</h2>
          <p style={{ fontSize: 14, color: t.textSoft, marginTop: 8 }}>Access your academic dashboard</p>
        </div>
        <form onSubmit={submit} style={s.card}>
          <div style={{ marginBottom: 16 }}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@ecap.edu" aria-label="Email address" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Enter password" aria-label="Password" />
          </div>
          {error && <p style={{ fontSize: 13, color: t.red, marginBottom: 12 }}>{error}</p>}
          <button type="submit" style={{ ...s.btn('primary'), width: '100%', justifyContent: 'center' }}>Sign In</button>
        </form>
        <p style={{ fontSize: 12, color: t.textSoft, textAlign: 'center', marginTop: 16 }}>
          Demo: <span style={{ color: t.link }}>aarav@ecap.edu</span> / pass123 · <span style={{ color: t.link }}>admin@ecap.edu</span> / admin123
        </p>
      </div>
    );
  };

  // ═════════════════════════════════════════════════════════════
  //  SUBJECTS (public)
  // ═════════════════════════════════════════════════════════════
  const SubjectsPage = () => {
    const [filter, setFilter] = useState('');
    const [deptFilter, setDeptFilter] = useState('All');
    const depts = ['All', ...new Set(PUBLIC_SUBJECTS.map((s) => s.dept))];
    const filtered = PUBLIC_SUBJECTS.filter(
      (sub) => (deptFilter === 'All' || sub.dept === deptFilter) &&
        (sub.name.toLowerCase().includes(filter.toLowerCase()) || sub.code.toLowerCase().includes(filter.toLowerCase()))
    );
    return (
      <div style={s.container}>
        <h2 style={{ ...s.heading(32), marginBottom: 4 }}>Subjects</h2>
        <p style={{ fontSize: 15, color: t.textSoft, marginBottom: 24 }}>Browse available courses — no login required.</p>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <input style={{ ...s.input, paddingLeft: 36 }} placeholder="Search subjects..." value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Search subjects" />
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: t.textSoft }}><Icon name="search" size={16} /></span>
          </div>
          <select style={{ ...s.input, width: 'auto', minWidth: 160 }} value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} aria-label="Filter by department">
            {depts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {filtered.map((sub) => (
            <div key={sub.code} style={s.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: t.accent, background: `${t.accent}15`, padding: '2px 8px', borderRadius: 4 }}>{sub.code}</span>
                <span style={{ fontSize: 12, color: t.textSoft }}>{sub.credits} Credits · Sem {sub.semester}</span>
              </div>
              <h3 style={{ ...s.heading(17), marginTop: 4 }}>{sub.name}</h3>
              <p style={{ fontSize: 13, color: t.textSoft, margin: '4px 0 0' }}>{sub.dept}</p>
            </div>
          ))}
          {filtered.length === 0 && <p style={{ textAlign: 'center', color: t.textSoft, padding: 40 }}>No subjects found.</p>}
        </div>
      </div>
    );
  };

  // ═════════════════════════════════════════════════════════════
  //  MATERIALS (public)
  // ═════════════════════════════════════════════════════════════
  const MaterialsPage = () => (
    <div style={s.container}>
      <h2 style={{ ...s.heading(32), marginBottom: 4 }}>Course Materials</h2>
      <p style={{ fontSize: 15, color: t.textSoft, marginBottom: 24 }}>Free educational resources — no login required.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {PUBLIC_SUBJECTS.map((sub) => (
          <div key={sub.code} style={s.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Icon name="book" size={16} />
              <span style={{ fontSize: 12, fontWeight: 600, color: t.accent }}>{sub.code}</span>
            </div>
            <h3 style={{ ...s.heading(16), marginBottom: 12 }}>{sub.name}</h3>
            {sub.materials.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderTop: i > 0 ? `0.5px solid ${t.border}` : 'none' }}>
                <Icon name="download" size={14} />
                <span style={{ fontSize: 13, color: t.link, cursor: 'pointer' }}>{m}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  // ═════════════════════════════════════════════════════════════
  //  STUDENT DASHBOARD (login required)
  // ═════════════════════════════════════════════════════════════
  const StudentDashboard = () => {
    const [tab, setTab] = useState('overview');
    if (!user || user.role === 'admin') return null;

    const StatCard = ({ label, value, sub, color }) => (
      <div style={s.card}>
        <p style={{ fontSize: 12, fontWeight: 600, color: t.textSoft, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px' }}>{label}</p>
        <p style={{ fontSize: 32, fontWeight: 700, color: color || t.text, margin: '0 0 2px', letterSpacing: '-0.02em' }}>{value}</p>
        {sub && <p style={{ fontSize: 13, color: t.textSoft, margin: 0 }}>{sub}</p>}
      </div>
    );

    const AchievementsTab = () => {
      const [newA, setNewA] = useState('');
      return (
        <div>
          <h3 style={{ ...s.heading(20), marginBottom: 16 }}>Your Achievements</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <input style={{ ...s.input, flex: 1 }} placeholder="Add a new achievement..." value={newA} onChange={(e) => setNewA(e.target.value)} aria-label="New achievement" />
            <button onClick={() => { if (newA.trim()) { handleAddAchievement(newA.trim()); setNewA(''); } }} style={s.btn('primary')}><Icon name="upload" size={14} /> Add</button>
          </div>
          {user.achievements.length === 0
            ? <div style={{ ...s.card, textAlign: 'center', padding: 40 }}><Icon name="award" size={32} /><p style={{ color: t.textSoft, marginTop: 8 }}>No achievements yet.</p></div>
            : <div style={{ display: 'grid', gap: 8 }}>
                {user.achievements.map((a, i) => (
                  <div key={i} style={{ ...s.card, display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${t.green}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.green, flexShrink: 0 }}><Icon name="check" size={16} /></div>
                    <span style={{ fontSize: 14 }}>{a}</span>
                  </div>
                ))}
              </div>
          }
        </div>
      );
    };

    const PasswordTab = () => {
      const [oldPw, setOldPw] = useState('');
      const [newPw, setNewPw] = useState('');
      const [confirm, setConfirm] = useState('');
      const [err, setErr] = useState('');
      const submit = () => {
        if (newPw !== confirm) { setErr("Passwords don't match"); return; }
        if (newPw.length < 4)  { setErr('Min 4 characters'); return; }
        if (!handlePasswordReset(oldPw, newPw)) { setErr('Current password is incorrect'); return; }
        setOldPw(''); setNewPw(''); setConfirm(''); setErr('');
      };
      return (
        <div style={{ maxWidth: 420 }}>
          <h3 style={{ ...s.heading(20), marginBottom: 16 }}>Reset Password</h3>
          <div style={s.card}>
            {[{ l: 'Current Password', v: oldPw, set: setOldPw }, { l: 'New Password', v: newPw, set: setNewPw }, { l: 'Confirm', v: confirm, set: setConfirm }].map((f, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <label style={s.label}>{f.l}</label>
                <input style={s.input} type="password" value={f.v} onChange={(e) => f.set(e.target.value)} aria-label={f.l} />
              </div>
            ))}
            {err && <p style={{ fontSize: 13, color: t.red, marginBottom: 12 }}>{err}</p>}
            <button onClick={submit} style={s.btn('primary')}>Update Password</button>
          </div>
        </div>
      );
    };

    const tabs = [
      { id: 'overview',     label: 'Overview',      icon: 'home' },
      { id: 'achievements', label: 'Achievements',  icon: 'award' },
      { id: 'password',     label: 'Reset Password',icon: 'key' },
    ];

    return (
      <div style={s.container}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 14, color: t.textSoft, margin: '0 0 4px' }}>Welcome back,</p>
          <h2 style={s.heading(32)}>{user.name}</h2>
          <p style={{ fontSize: 14, color: t.textSoft, margin: '4px 0 0' }}>{user.id} · {user.department} · Year {user.year}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, borderBottom: `0.5px solid ${t.border}`, paddingBottom: 8, flexWrap: 'wrap' }}>
          {tabs.map((tb) => (
            <button key={tb.id} onClick={() => setTab(tb.id)} style={{ ...s.btn('outline'), background: tab === tb.id ? t.bg2 : 'transparent', border: 'none', fontSize: 13 }}>
              <Icon name={tb.icon} size={14} /> {tb.label}
            </button>
          ))}
        </div>
        {tab === 'overview' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
              <StatCard label="CGPA" value={user.cgpa.toFixed(1)} sub="out of 10.0" color={user.cgpa >= 8 ? t.green : user.cgpa >= 6 ? t.orange : t.red} />
              <StatCard label="Attendance" value={`${user.attendance}%`} sub={user.attendance >= 90 ? 'Excellent' : user.attendance >= 75 ? 'Satisfactory' : 'Below minimum'} color={user.attendance >= 90 ? t.green : user.attendance >= 75 ? t.orange : t.red} />
              <StatCard label="Fee Dues" value={user.feeDue > 0 ? `₹${user.feeDue.toLocaleString()}` : 'Nil'} sub={user.feeDue > 0 ? 'Pending' : 'All clear'} color={user.feeDue > 0 ? t.red : t.green} />
              <StatCard label="Achievements" value={user.achievements.length} sub="recorded" />
            </div>
            <div style={s.card}>
              <h3 style={{ ...s.heading(17), marginBottom: 12 }}>Academic Profile</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {[{ l: 'Qualification', v: user.qualification }, { l: 'Department', v: user.department }, { l: 'Year', v: `Year ${user.year}` }, { l: 'Email', v: user.email }].map((item, i) => (
                  <div key={i}>
                    <p style={{ fontSize: 12, color: t.textSoft, margin: '0 0 2px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>{item.l}</p>
                    <p style={{ fontSize: 15, margin: 0, color: t.text }}>{item.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {tab === 'achievements' && <AchievementsTab />}
        {tab === 'password' && <PasswordTab />}
      </div>
    );
  };

  // ═════════════════════════════════════════════════════════════
  //  ADMIN DASHBOARD
  // ═════════════════════════════════════════════════════════════
  const AdminDashboard = () => {
    const [tab, setTab] = useState('students');
    const [csvText, setCsvText] = useState('');
    const [search, setSearch] = useState('');
    const [editId, setEditId] = useState(null);
    const [editField, setEditField] = useState('');
    const [editValue, setEditValue] = useState('');

    if (!user || user.role !== 'admin') return null;

    const filteredStudents = students.filter((st) =>
      st.name.toLowerCase().includes(search.toLowerCase()) ||
      st.id.toLowerCase().includes(search.toLowerCase()) ||
      st.email.toLowerCase().includes(search.toLowerCase())
    );

    const parseCsv = () => {
      const lines = csvText.trim().split('\n').filter((l) => l.trim());
      if (!lines.length) { showToast('No data', 'error'); return; }
      const data = lines.map((l) => l.split(',').map((c) => c.trim()));
      const isHeader = isNaN(parseFloat(data[0][3]));
      handleBulkUpload(isHeader ? data.slice(1) : data);
      setCsvText('');
    };

    const saveEdit = () => {
      if (!editId || !editField) return;
      let val = editValue;
      if (['year', 'feeDue'].includes(editField)) val = parseInt(val) || 0;
      if (['cgpa', 'attendance'].includes(editField)) val = parseFloat(val) || 0;
      handleModifyStudent(editId, editField, val);
      showToast(`Updated ${editField} for ${editId}`, 'success');
      setEditId(null);
    };

    const logs = logger.getLogs();

    const thStyle = { textAlign: 'left', padding: '10px 8px', color: t.textSoft, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' };

    return (
      <div style={s.container}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 14, color: t.textSoft, margin: '0 0 4px' }}>Administrator Panel</p>
          <h2 style={s.heading(32)}>Manage ECAP</h2>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 28, borderBottom: `0.5px solid ${t.border}`, paddingBottom: 8, flexWrap: 'wrap' }}>
          {[{ id: 'students', label: 'Students', icon: 'users' }, { id: 'upload', label: 'Bulk Upload', icon: 'upload' }, { id: 'logs', label: 'Event Logs', icon: 'log' }].map((tb) => (
            <button key={tb.id} onClick={() => setTab(tb.id)} style={{ ...s.btn('outline'), background: tab === tb.id ? t.bg2 : 'transparent', border: 'none', fontSize: 13 }}>
              <Icon name={tb.icon} size={14} /> {tb.label}
            </button>
          ))}
        </div>

        {/* ── Students tab ── */}
        {tab === 'students' && (
          <>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                <input style={{ ...s.input, paddingLeft: 36 }} placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search students" />
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: t.textSoft }}><Icon name="search" size={16} /></span>
              </div>
              <span style={{ fontSize: 13, color: t.textSoft }}>{students.length} total</span>
            </div>

            {editId && (
              <div style={{ ...s.card, marginBottom: 16, background: isDark ? t.bg3 : '#fffbe6', border: `1px solid ${t.orange}` }}>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: t.text }}>Editing {editId}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div>
                    <label style={s.label}>Field</label>
                    <select style={{ ...s.input, width: 'auto' }} value={editField} onChange={(e) => setEditField(e.target.value)}>
                      <option value="">Select...</option>
                      {['name', 'email', 'department', 'year', 'cgpa', 'attendance', 'feeDue', 'qualification'].map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1, minWidth: 150 }}>
                    <label style={s.label}>New Value</label>
                    <input style={s.input} value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                  </div>
                  <button onClick={saveEdit} style={s.btn('primary')}>Save</button>
                  <button onClick={() => setEditId(null)} style={s.btn('outline')}>Cancel</button>
                </div>
              </div>
            )}

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                    {['ID', 'Name', 'Dept', 'Yr', 'CGPA', 'Att%', 'Fee Due', 'Action'].map((h) => <th key={h} style={thStyle}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((st) => (
                    <tr key={st.id} style={{ borderBottom: `0.5px solid ${t.border}` }}>
                      <td style={{ padding: '10px 8px', fontFamily: 'monospace', fontSize: 12, color: t.text }}>{st.id}</td>
                      <td style={{ padding: '10px 8px', fontWeight: 500, color: t.text }}>{st.name}</td>
                      <td style={{ padding: '10px 8px', color: t.textSoft }}>{st.department}</td>
                      <td style={{ padding: '10px 8px', color: t.text }}>{st.year}</td>
                      <td style={{ padding: '10px 8px', color: st.cgpa >= 8 ? t.green : t.text, fontWeight: 500 }}>{st.cgpa}</td>
                      <td style={{ padding: '10px 8px', color: st.attendance >= 90 ? t.green : st.attendance < 75 ? t.red : t.text }}>{st.attendance}%</td>
                      <td style={{ padding: '10px 8px', color: st.feeDue > 0 ? t.red : t.green, fontWeight: 500 }}>{st.feeDue > 0 ? `₹${st.feeDue.toLocaleString()}` : 'Nil'}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <button onClick={() => { setEditId(st.id); setEditField(''); setEditValue(''); }} style={{ ...s.btn('small'), fontSize: 12, padding: '4px 10px' }}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── Bulk Upload tab ── */}
        {tab === 'upload' && (
          <div style={{ maxWidth: 680 }}>
            <h3 style={{ ...s.heading(20), marginBottom: 8 }}>Bulk Upload Students</h3>
            <p style={{ fontSize: 14, color: t.textSoft, marginBottom: 16 }}>
              CSV format: Name, Email, Department, Year, CGPA, Attendance, FeeDue, Qualification
            </p>
            <div style={s.card}>
              <textarea
                style={{ ...s.input, minHeight: 160, fontFamily: 'monospace', fontSize: 13, resize: 'vertical' }}
                placeholder={'Name,Email,Department,Year,CGPA,Attendance,FeeDue,Qualification\nJohn Doe,john@ecap.edu,Computer Science,2,8.5,91,0,B.Tech CSE'}
                value={csvText} onChange={(e) => setCsvText(e.target.value)} aria-label="CSV data input"
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button onClick={parseCsv} style={s.btn('primary')}><Icon name="upload" size={14} /> Upload Data</button>
                <button onClick={() => setCsvText('Ravi Kumar,ravi@ecap.edu,Computer Science,2,8.2,90,5000,B.Tech CSE\nSita Ram,sita@ecap.edu,Electronics,1,7.8,88,0,B.Tech ECE')} style={s.btn('outline')}>Load Sample</button>
              </div>
            </div>
            <div style={{ ...s.card, marginTop: 16 }}>
              <h4 style={{ ...s.heading(16), marginBottom: 8 }}>Or upload a .csv file</h4>
              <input type="file" accept=".csv,.xlsx" style={{ fontSize: 13 }} onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => setCsvText(ev.target.result);
                reader.readAsText(file);
              }} aria-label="Upload CSV file" />
            </div>
          </div>
        )}

        {/* ── Logs tab ── */}
        {tab === 'logs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <h3 style={s.heading(20)}>Event Logs</h3>
              <button onClick={() => {
                const blob = new Blob([logger.exportAsText()], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'ecap_event_logs.txt'; a.click();
                URL.revokeObjectURL(url);
                logger.log('LOG_EXPORT', user.email, 'Logs exported');
              }} style={s.btn('outline')}><Icon name="download" size={14} /> Export Logs</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead><tr style={{ borderBottom: `1px solid ${t.border}` }}>
                  {['Timestamp', 'Event', 'User', 'Details'].map((h) => <th key={h} style={thStyle}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {logs.slice(0, 50).map((l) => (
                    <tr key={l.id} style={{ borderBottom: `0.5px solid ${t.border}` }}>
                      <td style={{ padding: '8px', fontFamily: 'monospace', fontSize: 11, whiteSpace: 'nowrap', color: t.textSoft }}>{new Date(l.timestamp).toLocaleString()}</td>
                      <td style={{ padding: '8px' }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                          background: l.event.includes('FAIL') ? `${t.red}18` : l.event.includes('LOGIN') || l.event.includes('LOGOUT') ? `${t.accent}18` : `${t.green}18`,
                          color: l.event.includes('FAIL') ? t.red : l.event.includes('LOGIN') || l.event.includes('LOGOUT') ? t.link : t.green,
                        }}>{l.event}</span>
                      </td>
                      <td style={{ padding: '8px', color: t.text }}>{l.user}</td>
                      <td style={{ padding: '8px', color: t.textSoft, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {logs.length === 0 && <p style={{ textAlign: 'center', color: t.textSoft, padding: 40 }}>No events recorded yet.</p>}
          </div>
        )}
      </div>
    );
  };

  // ═════════════════════════════════════════════════════════════
  //  RENDER
  // ═════════════════════════════════════════════════════════════
  const pages = {
    home: <HomePage />,
    login: <LoginPage />,
    subjects: <SubjectsPage />,
    materials: <MaterialsPage />,
    dashboard: <StudentDashboard />,
    'admin-dashboard': <AdminDashboard />,
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif", color: t.text, background: t.bg, minHeight: '100vh', transition: 'background 0.3s, color 0.3s' }}>
      <Nav />
      {pages[page] || <HomePage />}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          background: toast.type === 'success' ? t.green : toast.type === 'error' ? t.red : t.accent,
          color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 14, fontWeight: 500,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)', animation: 'slideUp 0.3s ease',
        }}>{toast.msg}</div>
      )}
    </div>
  );
}
