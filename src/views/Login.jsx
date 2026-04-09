import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ── Inline SVG illustrations & icons ─────────────────────────── */

const MeditationIllustration = () => (
  <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 340, height: 'auto' }}>
    {/* Glow background circles */}
    <circle cx="160" cy="150" r="110" fill="url(#outerGlow)" opacity="0.18" />
    <circle cx="160" cy="150" r="75" fill="url(#innerGlow)" opacity="0.22" />

    {/* Ground / mat */}
    <ellipse cx="160" cy="220" rx="80" ry="10" fill="url(#matGrad)" opacity="0.6" />

    {/* Body – torso */}
    <path d="M130 180 Q160 170 190 180 L185 215 Q160 222 135 215 Z" fill="url(#bodyGrad)" />

    {/* Left leg */}
    <path d="M135 215 Q115 218 100 212" stroke="url(#limbGrad)" strokeWidth="14" strokeLinecap="round" fill="none" />
    {/* Right leg */}
    <path d="M185 215 Q205 218 220 212" stroke="url(#limbGrad)" strokeWidth="14" strokeLinecap="round" fill="none" />

    {/* Left arm resting */}
    <path d="M135 190 Q120 200 105 205" stroke="url(#limbGrad)" strokeWidth="11" strokeLinecap="round" fill="none" />
    {/* Right arm resting */}
    <path d="M185 190 Q200 200 215 205" stroke="url(#limbGrad)" strokeWidth="11" strokeLinecap="round" fill="none" />

    {/* Neck */}
    <rect x="154" y="158" width="12" height="18" rx="6" fill="#a78bfa" />

    {/* Head */}
    <circle cx="160" cy="145" r="22" fill="url(#headGrad)" />
    {/* Closed eyes – peaceful */}
    <path d="M151 143 Q154 140 157 143" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M163 143 Q166 140 169 143" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Smile */}
    <path d="M154 149 Q160 154 166 149" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round" fill="none" />

    {/* Floating habit icons */}
    {/* Dumbbell – top left */}
    <g transform="translate(48, 68)">
      <rect x="0" y="8" width="36" height="6" rx="3" fill="#7c3aed" opacity="0.8" />
      <rect x="-4" y="4" width="8" height="14" rx="4" fill="#a78bfa" opacity="0.9" />
      <rect x="32" y="4" width="8" height="14" rx="4" fill="#a78bfa" opacity="0.9" />
    </g>

    {/* Heart – top right */}
    <g transform="translate(240, 55)">
      <path d="M12 6 C12 6 6 1 1 5 C-2 8 2 13 12 20 C22 13 26 8 23 5 C18 1 12 6 12 6Z" fill="#f43f5e" opacity="0.85" />
    </g>

    {/* Leaf – right side */}
    <g transform="translate(255, 115)">
      <path d="M5 20 C5 20 0 8 10 2 C20 8 24 20 24 20 C14 22 5 20 5 20Z" fill="#22c55e" opacity="0.8" />
      <line x1="14" y1="20" x2="10" y2="5" stroke="#16a34a" strokeWidth="1.2" />
    </g>

    {/* Water drop – left */}
    <g transform="translate(40, 130)">
      <path d="M10 0 C10 0 0 12 0 18 C0 24 4.5 28 10 28 C15.5 28 20 24 20 18 C20 12 10 0 10 0Z" fill="#38bdf8" opacity="0.75" />
    </g>

    {/* Star / sparkle – upper center left */}
    <g transform="translate(90, 55)">
      <circle cx="8" cy="8" r="3" fill="#fbbf24" opacity="0.9" />
      <circle cx="8" cy="8" r="6" fill="#fbbf24" opacity="0.25" />
    </g>

    {/* Sparkle dots */}
    <circle cx="230" cy="170" r="3" fill="#a78bfa" opacity="0.6" />
    <circle cx="85" cy="190" r="2.5" fill="#38bdf8" opacity="0.5" />
    <circle cx="200" cy="85" r="2" fill="#fbbf24" opacity="0.7" />
    <circle cx="70" cy="105" r="2" fill="#22c55e" opacity="0.6" />

    {/* Aura rings */}
    <circle cx="160" cy="150" r="52" stroke="#7c3aed" strokeWidth="1" opacity="0.3" strokeDasharray="4 6" />
    <circle cx="160" cy="150" r="68" stroke="#5e5ce6" strokeWidth="0.8" opacity="0.2" strokeDasharray="3 8" />

    <defs>
      <radialGradient id="outerGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
      <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#5e5ce6" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
      <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#4f46e5" />
      </linearGradient>
      <linearGradient id="limbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#6d28d9" />
      </linearGradient>
      <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c4b5fd" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
      <linearGradient id="matGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="30%" stopColor="#5e5ce6" />
        <stop offset="70%" stopColor="#5e5ce6" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
  </svg>
);

/* ── Floating animated background orbs ───────────────────────── */
const BackgroundOrbs = () => (
  <div className="login-bg-orbs" aria-hidden="true">
    <div className="login-orb login-orb-1" />
    <div className="login-orb login-orb-2" />
    <div className="login-orb login-orb-3" />
  </div>
);

/* ── Stat pills shown on the left panel ──────────────────────── */
const StatPill = ({ icon, label, value, color }) => (
  <div className="login-stat-pill" style={{ '--pill-color': color }}>
    <span className="login-stat-icon">{icon}</span>
    <div>
      <div className="login-stat-value">{value}</div>
      <div className="login-stat-label">{label}</div>
    </div>
  </div>
);

/* ── Feature tag badges ───────────────────────────────────────── */
const FeatureBadge = ({ emoji, text }) => (
  <div className="login-feature-badge">
    <span>{emoji}</span>
    <span>{text}</span>
  </div>
);

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { user, login, signup } = useAuth();

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      login(email, password);
    } else {
      signup(name, email, password);
    }
  };

  return (
    <>
      {/* ── Scoped CSS injected via <style> ───────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        /* PAGE — locked to viewport, no scroll */
        .login-page {
          height: 100vh;
          height: 100dvh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #05040d;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 0;
          box-sizing: border-box;
        }

        /* BACKGROUND ORBS */
        .login-bg-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
        .login-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.28;
          animation: loginOrbFloat 8s ease-in-out infinite alternate;
        }
        .login-orb-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, #7c3aed, #4f46e5);
          top: -180px; left: -140px;
          animation-delay: 0s;
        }
        .login-orb-2 {
          width: 380px; height: 380px;
          background: radial-gradient(circle, #0ea5e9, #6d28d9);
          bottom: -120px; right: -100px;
          animation-delay: 2s;
        }
        .login-orb-3 {
          width: 280px; height: 280px;
          background: radial-gradient(circle, #22c55e, #0ea5e9);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 4s;
          opacity: 0.13;
        }
        @keyframes loginOrbFloat {
          from { transform: scale(1) translate(0, 0); }
          to   { transform: scale(1.12) translate(18px, -22px); }
        }

        /* WRAPPER — fills entire viewport */
        .login-wrapper {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 5fr 6fr;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          border-radius: 0;
          overflow: hidden;
          border: none;
          box-shadow: none;
          backdrop-filter: blur(4px);
        }

        /* LEFT PANEL */
        .login-left {
          background: linear-gradient(145deg, rgba(79,70,229,0.22) 0%, rgba(124,58,237,0.12) 100%);
          backdrop-filter: blur(24px);
          padding: 1.4rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-right: 1px solid rgba(255,255,255,0.07);
          position: relative;
          overflow: hidden;
        }
        .login-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, rgba(94,92,230,0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        .login-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.6rem;
        }
        .login-brand-icon {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #5e5ce6, #7c3aed);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem;
          box-shadow: 0 4px 16px rgba(94,92,230,0.5);
        }
        .login-brand-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.01em;
        }

        .login-hero-heading {
          font-size: clamp(1.35rem, 2.4vw, 1.9rem);
          font-weight: 900;
          color: #fff;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin-bottom: 0.35rem;
        }
        .login-hero-heading span {
          background: linear-gradient(90deg, #818cf8, #a78bfa, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .login-hero-sub {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.5;
          margin-bottom: 0.6rem;
        }

        .login-illustration { margin: 0 auto 0.4rem; flex: 1; display: flex; align-items: center; justify-content: center; max-height: 170px; overflow: hidden; }

        /* STAT PILLS */
        .login-stats { display: flex; flex-direction: row; gap: 0.4rem; }
        .login-stat-pill {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 0.45rem 0.65rem;
          backdrop-filter: blur(8px);
          transition: border-color 0.2s;
        }
        .login-stat-pill:hover { border-color: var(--pill-color, rgba(255,255,255,0.2)); }
        .login-stat-icon { font-size: 1.1rem; flex-shrink: 0; }
        .login-stat-value {
          font-size: 0.75rem;
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
        }
        .login-stat-label {
          font-size: 0.63rem;
          color: rgba(255,255,255,0.45);
          margin-top: 1px;
          white-space: nowrap;
        }

        /* RIGHT PANEL – FORM */
        .login-right {
          background: rgba(8, 7, 20, 0.75);
          backdrop-filter: blur(32px);
          padding: 1.4rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .login-form-header { margin-bottom: 0.9rem; }
        .login-tab-row {
          display: flex;
          gap: 0.5rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 5px;
          margin-bottom: 0.9rem;
        }
        .login-tab {
          flex: 1;
          padding: 0.6rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.25s ease;
          color: rgba(255,255,255,0.5);
          background: transparent;
          font-family: 'Inter', sans-serif;
        }
        .login-tab.active {
          background: linear-gradient(135deg, #5e5ce6, #7c3aed);
          color: #fff;
          box-shadow: 0 4px 12px rgba(94,92,230,0.45);
        }

        .login-form-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
          margin-bottom: 0.2rem;
        }
        .login-form-subtitle {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.45);
        }

        /* FORM FIELDS */
        .login-form { display: flex; flex-direction: column; gap: 0.7rem; }
        .login-field-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          margin-bottom: 0.25rem;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .login-input-wrap { position: relative; }
        .login-input-icon {
          position: absolute;
          left: 0.95rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1rem;
          opacity: 0.5;
          pointer-events: none;
        }
        .login-input {
          width: 100%;
          box-sizing: border-box;
          padding: 0.65rem 1rem 0.65rem 2.6rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          color: #fff;
          font-size: 0.925rem;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s;
        }
        .login-input::placeholder { color: rgba(255,255,255,0.25); }
        .login-input:focus {
          outline: none;
          border-color: #5e5ce6;
          background: rgba(94,92,230,0.08);
          box-shadow: 0 0 0 3px rgba(94,92,230,0.22);
        }
        .login-input-pw-toggle {
          position: absolute;
          right: 0.9rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          font-size: 1rem;
          padding: 0;
          line-height: 1;
          transition: color 0.2s;
        }
        .login-input-pw-toggle:hover { color: rgba(255,255,255,0.75); }

        /* SUBMIT BUTTON */
        .login-submit-btn {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          background: linear-gradient(135deg, #5e5ce6 0%, #7c3aed 100%);
          color: #fff;
          box-shadow: 0 6px 24px rgba(94,92,230,0.5), 0 0 0 1px rgba(255,255,255,0.05);
          transition: all 0.25s ease;
          letter-spacing: 0.01em;
          margin-top: 0.1rem;
          position: relative;
          overflow: hidden;
        }
        .login-submit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .login-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(94,92,230,0.65), 0 0 0 1px rgba(255,255,255,0.08);
        }
        .login-submit-btn:hover::after { opacity: 1; }
        .login-submit-btn:active { transform: translateY(0); }

        /* TOGGLE */
        .login-toggle {
          text-align: center;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.4);
          margin-top: 0.65rem;
        }
        .login-toggle-link {
          background: none;
          border: none;
          color: #818cf8;
          font-weight: 700;
          cursor: pointer;
          font-size: inherit;
          font-family: inherit;
          padding: 0;
          text-decoration: none;
          transition: color 0.2s;
        }
        .login-toggle-link:hover { color: #a78bfa; text-decoration: underline; }

        /* FEATURE BADGES */
        .login-feature-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.65rem;
        }
        .login-feature-badge {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 99px;
          padding: 0.3rem 0.75rem;
        }

        /* DIVIDER */
        .login-divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: rgba(255,255,255,0.2);
          font-size: 0.75rem;
          margin: 0.25rem 0;
        }
        .login-divider::before, .login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        /* ANIMATION */
        @keyframes loginFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-animate { animation: loginFadeUp 0.55s ease both; }
        .login-animate-delay-1 { animation-delay: 0.08s; }
        .login-animate-delay-2 { animation-delay: 0.16s; }
        .login-animate-delay-3 { animation-delay: 0.24s; }

        /* ── RESPONSIVE ──────────────────────────────────────── */
        @media (max-width: 768px) {
          .login-page { padding: 1rem; }
          .login-wrapper {
            grid-template-columns: 1fr;
            min-height: unset;
            border-radius: 22px;
          }
          .login-left {
            padding: 2rem 1.75rem 1.5rem;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.07);
          }
          .login-illustration { max-width: 220px; margin: 0 auto 1rem; }
          .login-hero-heading { font-size: 1.65rem; }
          .login-stats { flex-direction: row; flex-wrap: wrap; }
          .login-stat-pill { flex: 1; min-width: 140px; }
          .login-right { padding: 2rem 1.75rem; }
        }

        @media (max-width: 420px) {
          .login-left { padding: 1.5rem 1.25rem; }
          .login-right { padding: 1.5rem 1.25rem; }
          .login-stats { flex-direction: column; }
          .login-stat-pill { min-width: unset; }
        }
      `}</style>

      <div className="login-page">
        <BackgroundOrbs />

        <div className="login-wrapper">
          {/* ═══════════════ LEFT PANEL ═══════════════ */}
          <div className="login-left">
            {/* Brand */}
            <div>
              <div className="login-brand login-animate">
                <div className="login-brand-icon">🏃</div>
                <span className="login-brand-name">Smart Habit Tracker</span>
              </div>

              <h1 className="login-hero-heading login-animate login-animate-delay-1">
                Build <span>Healthy Habits</span>,<br />
                Transform Your Life
              </h1>
              <p className="login-hero-sub login-animate login-animate-delay-2">
                Track workouts, meditation, nutrition and daily rituals — all in one beautiful dashboard.
              </p>
            </div>

            {/* Illustration */}
            <div className="login-illustration login-animate login-animate-delay-2">
              <MeditationIllustration />
            </div>

            {/* Stats */}
            <div className="login-stats login-animate login-animate-delay-3">
              <StatPill icon="🔥" label="Streaks tracked" value="10,000+ habits" color="#f97316" />
              <StatPill icon="🧘" label="Mindfulness minutes" value="500K+ logged" color="#818cf8" />
              <StatPill icon="💪" label="Active users" value="25K+ members" color="#22c55e" />
            </div>

            {/* Feature badges */}
            <div className="login-feature-badges login-animate login-animate-delay-3">
              <FeatureBadge emoji="🏋️" text="Gym" />
              <FeatureBadge emoji="🧘" text="Yoga" />
              <FeatureBadge emoji="🥗" text="Nutrition" />
              <FeatureBadge emoji="😴" text="Sleep" />
              <FeatureBadge emoji="📈" text="Analytics" />
            </div>
          </div>

          {/* ═══════════════ RIGHT PANEL ═══════════════ */}
          <div className="login-right">
            {/* Tab switcher */}
            <div className="login-tab-row login-animate">
              <button
                className={`login-tab${isLogin ? ' active' : ''}`}
                onClick={() => setIsLogin(true)}
                type="button"
              >
                Sign In
              </button>
              <button
                className={`login-tab${!isLogin ? ' active' : ''}`}
                onClick={() => setIsLogin(false)}
                type="button"
              >
                Sign Up
              </button>
            </div>

            <div className="login-form-header login-animate login-animate-delay-1">
              <div className="login-form-title">
                {isLogin ? 'Welcome back 👋' : 'Join the journey 🚀'}
              </div>
              <div className="login-form-subtitle">
                {isLogin
                  ? 'Sign in to continue your fitness journey'
                  : 'Start building life-changing habits today'}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="login-form login-animate login-animate-delay-2">
              {/* Name field – signup only */}
              {!isLogin && (
                <div>
                  <label className="login-field-label" htmlFor="login-name">Full Name</label>
                  <div className="login-input-wrap">
                    <span className="login-input-icon">👤</span>
                    <input
                      id="login-name"
                      type="text"
                      className="login-input"
                      placeholder="Your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="login-field-label" htmlFor="login-email">Email Address</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">✉️</span>
                  <input
                    id="login-email"
                    type="email"
                    className="login-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="login-field-label" htmlFor="login-password">Password</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">🔒</span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="login-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    style={{ paddingRight: '2.75rem' }}
                  />
                  <button
                    type="button"
                    className="login-input-pw-toggle"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="login-divider">or continue with email</div>

              <button type="submit" className="login-submit-btn" id="login-submit-btn">
                {isLogin ? '⚡ Sign In & Continue' : '🚀 Create My Account'}
              </button>
            </form>

            <div className="login-toggle login-animate login-animate-delay-3">
              {isLogin ? "New to Smart Habit Tracker? " : "Already have an account? "}
              <button
                type="button"
                className="login-toggle-link"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Create free account' : 'Sign in instead'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
