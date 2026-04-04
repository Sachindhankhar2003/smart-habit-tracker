import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, BarChart2, Settings, LogOut, Moon, Sun, Bell, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../context/HabitContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
  const { user, logout } = useAuth();
  const { points, level, habits } = useHabits();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [notifsEnabled, setNotifsEnabled] = useState(Notification.permission === 'granted');
  const location = useLocation();

  useEffect(() => {
    if (notifsEnabled && document.visibilityState === 'visible') {
      const interval = setInterval(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const uncompleted = habits.filter(h => h.frequency === 'daily' && !h.completedDates.includes(todayStr));
        if (uncompleted.length > 0) {
          new Notification("Smart Habit Tracker", {
            body: `Don't forget! You have ${uncompleted.length} habits left to complete today.`,
            icon: '/smart-habit-tracker/pwa-192x192.png'
          });
        }
      }, 60000); // Check every 60 seconds for demo purposes
      return () => clearInterval(interval);
    }
  }, [notifsEnabled, habits]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const requestNotifications = () => {
    if (!('Notification' in window)) return;
    Notification.requestPermission().then(permission => {
      setNotifsEnabled(permission === 'granted');
      if (permission === 'granted') {
        const todayStr = new Date().toISOString().split('T')[0];
        const dueHabits = habits.filter(h => h.frequency === 'daily' && !h.completedDates.includes(todayStr));
        if (dueHabits.length > 0) {
          new Notification("Smart Habit Tracker", {
            body: `You have ${dueHabits.length} habits left to complete today!`
          });
        }
      }
    });
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={22} />, label: 'Summary' },
    { to: '/habits', icon: <CheckSquare size={22} />, label: 'Habits' },
    { to: '/fitness', icon: <Activity size={22} />, label: 'Fitness' },
    { to: '/analytics', icon: <BarChart2 size={22} />, label: 'Trends' },
  ];

  return (
    <div className="app-container">
      {/* Mobile Top Header */}
      <div className="mobile-header">
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity color="var(--primary)" size={20} /> Smart Habit
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <span className="badge">⭐ {points}</span>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Activity color="var(--primary)" size={28} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Smart Habit
          </h1>
        </div>
        
        <div style={{ padding: '0 1.5rem 1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Level {level}</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--warning)' }}>⭐ {points} pts</span>
          </div>
          <progress value={points % 50} max="50" style={{ width: '100%', height: '6px', borderRadius: '4px' }} />
        </div>

        <nav style={{ flex: 1, padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map(item => (
            <NavLink 
              key={item.to} 
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--primary-glow)' : 'transparent',
                color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.2s',
              })}
            >
              {({ isActive }) => (
                <>
                  <div style={{ color: isActive ? 'var(--primary)' : 'inherit' }}>{item.icon}</div>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
          <NavLink 
            to="/settings"
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-md)', backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: isActive ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: isActive ? '600' : '500',
              marginTop: 'auto'
            })}
          >
            <Settings size={22} /> Settings
          </NavLink>
        </nav>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button className={`btn ${notifsEnabled ? 'btn-success' : 'btn-secondary'}`} onClick={requestNotifications}>
            <Bell size={16} /> {notifsEnabled ? 'Reminders On' : 'Reminders'}
          </button>
          <button className="btn btn-secondary" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />} 
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          
          <button style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', padding: '0.5rem 0' }} onClick={logout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
      
      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        {navItems.map(item => (
          <NavLink 
            key={item.to} 
            to={item.to}
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ height: '100%', maxWidth: '1000px', margin: '0 auto' }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
