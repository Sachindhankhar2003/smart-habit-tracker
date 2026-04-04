import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all habit data? This cannot be undone.")) {
      localStorage.removeItem('smart_habits_data');
      window.location.reload();
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Settings</h2>
      
      <div className="card glass-panel" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <div>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Profile Information</h3>
          <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <p><strong>Name:</strong> {user?.name}</p>
            <p style={{ marginTop: '0.5rem' }}><strong>Email:</strong> {user?.email}</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Display Preferences</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div>
              <p style={{ fontWeight: '500' }}>Dark Mode</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Switch between light and dark themes</p>
            </div>
            <button 
              className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`} 
              onClick={toggleTheme}
            >
              {theme === 'dark' ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: 'var(--danger)' }}>Danger Zone</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <div>
              <p style={{ fontWeight: '500', color: 'var(--danger)' }}>Reset Data</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Delete all your habits and start fresh</p>
            </div>
            <button className="btn btn-danger" onClick={handleClearData}>
              Clear Data
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
