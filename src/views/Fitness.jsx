import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const ConcentricRings = ({ stepsProgress, activeProgress, caloriesProgress }) => {
  const size = 300;
  const strokeWidth = 24;
  const gap = 6;
  const center = size / 2;

  // Ring configurations (Outer to Inner)
  const rings = [
    { name: 'Steps', progress: stepsProgress, colorId: 'redNeon', radius: (size - strokeWidth)/2, grad1: '#ff453a', grad2: '#ff9f0a' },
    { name: 'Active', progress: activeProgress, colorId: 'greenNeon', radius: (size - strokeWidth)/2 - (strokeWidth + gap), grad1: '#30d158', grad2: '#a4e810' },
    { name: 'Calories', progress: caloriesProgress, colorId: 'blueNeon', radius: (size - strokeWidth)/2 - 2*(strokeWidth + gap), grad1: '#0a84ff', grad2: '#64d2ff' }
  ];

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', dropShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
        <defs>
          {rings.map(r => (
            <linearGradient id={r.colorId} x1="0%" y1="0%" x2="100%" y2="100%" key={r.colorId}>
              <stop offset="0%" stopColor={r.grad1} />
              <stop offset="100%" stopColor={r.grad2} />
            </linearGradient>
          ))}
        </defs>

        {/* Background Rings */}
        {rings.map((r, i) => (
          <circle 
            key={`bg-${i}`} 
            cx={center} cy={center} r={r.radius} 
            fill="transparent" stroke={`rgba(255,255,255,0.05)`} strokeWidth={strokeWidth} 
          />
        ))}

        {/* Animated Fill Rings */}
        {rings.map((r, i) => {
          const circumference = r.radius * 2 * Math.PI;
          const safeProgress = Math.min(100, Math.max(0, r.progress));
          const strokeDashoffset = circumference - (safeProgress / 100) * circumference;

          return (
            <motion.circle
              key={`fill-${i}`}
              cx={center} cy={center} r={r.radius} 
              fill="transparent" stroke={`url(#${r.colorId})`} strokeWidth={strokeWidth} 
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.8, ease: "easeOut", delay: i * 0.2 }}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0px 0px 8px ${r.grad1}80)` }} // Glowing effect
            />
          );
        })}
      </svg>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, margin: 0 }}>
          {Math.min(100, Math.round((Math.max(0, stepsProgress) + Math.max(0, activeProgress) + Math.max(0, caloriesProgress)) / 3))}<span style={{fontSize: '1.5rem'}}>%</span>
        </h2>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Goals</p>
      </div>
    </div>
  );
};

export default function Fitness() {
  const { 
    steps, updateSteps, distance, calories, activeMinutes, stepGoal, activeMinutesGoal,
    isMotionSupported, motionPermission, requestMotionPermission
  } = useFitness();
  const [inputSteps, setInputSteps] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    if (inputSteps !== '') {
      updateSteps(inputSteps);
      setInputSteps('');
    }
  };

  const stepsProgress = Math.round((steps / stepGoal) * 100);
  const activeProgress = Math.round((activeMinutes / activeMinutesGoal) * 100);
  const caloriesProgress = Math.round((calories / 300) * 100); // 300kcal arbitrary goal

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Activity</h2>
      </motion.div>

      {/* Main Concentric Rings Display */}
      <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
        <ConcentricRings 
          stepsProgress={stepsProgress} 
          activeProgress={activeProgress} 
          caloriesProgress={caloriesProgress} 
        />
      </motion.div>

      {/* Legend & Stats */}
      <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#ff453a', fontWeight: 'bold' }}>Steps</p>
          <h3 style={{ fontSize: '1.5rem' }}>{steps}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {stepGoal}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#30d158', fontWeight: 'bold' }}>Active min</p>
          <h3 style={{ fontSize: '1.5rem' }}>{activeMinutes}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {activeMinutesGoal}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#0a84ff', fontWeight: 'bold' }}>Calories</p>
          <h3 style={{ fontSize: '1.5rem' }}>{calories}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>kcal</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="card glass-panel" style={{ marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
        <h3 style={{ marginBottom: '1rem' }}>Log Activity</h3>
        
        {isMotionSupported && motionPermission !== 'granted' && (
          <div style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: 'rgba(255, 214, 10, 0.1)', border: '1px solid var(--warning)', borderRadius: 'var(--radius-sm)' }}>
             <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Enable the real pedometer to automatically count your steps using your phone's physical motion sensors!</p>
             <button onClick={requestMotionPermission} className="btn" style={{ backgroundColor: 'var(--warning)', color: '#000', fontSize: '0.75rem', padding: '0.5rem 1rem' }}>
               {motionPermission === 'denied' ? 'Permission Denied (Check Device Settings)' : 'Allow Motion Access'}
             </button>
          </div>
        )}
        
        {isMotionSupported && motionPermission === 'granted' && (
          <div style={{ padding: '0.5rem 1rem', marginBottom: '1rem', backgroundColor: 'rgba(48, 209, 88, 0.1)', border: '1px solid var(--success)', borderRadius: 'var(--radius-sm)' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="spinner" style={{display: 'inline-block', border: '2px solid rgba(48,209,88,0.3)', borderTopColor: 'var(--success)', borderRadius: '50%', width: '12px', height: '12px'}} /> 
              Real-time Motion Pedometer Active
            </p>
          </div>
        )}

        <form onSubmit={handleUpdate} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input 
            type="number" 
            placeholder={`Enter today's steps...`} 
            className="input-field" 
            value={inputSteps} 
            onChange={e => setInputSteps(e.target.value)} 
            style={{ flex: 1, minWidth: '200px' }}
          />
          <motion.button whileTap={{ scale: 0.95 }} type="submit" className="btn btn-primary" style={{ minWidth: '120px' }}>
            Update
          </motion.button>
        </form>
      </motion.div>

      <motion.div variants={itemVariants} className="card glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          Distance Log
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Distance Walked</p>
            <p style={{ fontWeight: 'bold', fontSize: '1.5rem', marginTop: '0.25rem' }}>{distance} <span style={{fontSize: '1rem', color: 'var(--text-muted)'}}>km</span></p>
          </div>
          <div style={{ fontSize: '2rem', filter: 'grayscale(100%) opacity(50%)' }}>
            👟
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
