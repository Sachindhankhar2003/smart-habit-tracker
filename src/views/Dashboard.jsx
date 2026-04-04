import React from 'react';
import { useHabits } from '../context/HabitContext';
import { useFitness } from '../context/FitnessContext';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function Dashboard() {
  const { habits, toggleComplete, points, achievements: habitBadges } = useHabits();
  const { fitnessAchievements, steps, stepGoal, activeMinutes, activeMinutesGoal, calories } = useFitness();
  const achievements = [...habitBadges, ...(fitnessAchievements || [])];
  
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  const habitsDueToday = habits.filter(h => h.frequency === 'daily' || new Date(h.startDate) <= today);
  const completedToday = habits.filter(h => h.completedDates.includes(todayStr)).length;
  const progress = habitsDueToday.length > 0 ? Math.round((completedToday / habitsDueToday.length) * 100) : 0;

  const highStreakHabits = habits.filter(h => h.streak >= 7);

  // Calculate Health Score (Max 100)
  const habitScore = progress * 0.3; // 30% weight
  const stepScore = Math.min(30, (steps / stepGoal) * 30); // 30% weight
  const activeScore = Math.min(20, (activeMinutes / activeMinutesGoal) * 20); // 20% weight
  const calorieScore = Math.min(20, (calories / 300) * 20); // 20% weight
  const healthScore = Math.round(habitScore + stepScore + activeScore + calorieScore);

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Dashboard</h2>
        {highStreakHabits.length > 0 && (
          <span className="badge" title={`You have ${highStreakHabits.length} habits with a 7+ day streak!`}>🔥 Active Streak!</span>
        )}
      </motion.div>
      
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card glass-panel" style={{ borderLeft: '4px solid #30d158' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Daily Health Score</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#30d158' }}>{healthScore}<span style={{fontSize:'1rem', color:'var(--text-muted)'}}>/100</span></p>
          <div style={{ width: '100%', backgroundColor: 'var(--border-color)', height: '8px', borderRadius: '4px', marginTop: '0.5rem' }}>
            <motion.div 
              initial={{ width: 0 }} animate={{ width: `${healthScore}%` }} transition={{ duration: 1, ease: 'easeOut' }}
              style={{ backgroundColor: '#30d158', height: '100%', borderRadius: '4px' }} 
            />
          </div>
        </div>
        <div className="card glass-panel" style={{ borderLeft: '4px solid var(--primary)' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Today's Habit Progress</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{progress}%</p>
          <div style={{ width: '100%', backgroundColor: 'var(--border-color)', height: '8px', borderRadius: '4px', marginTop: '0.5rem' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ backgroundColor: 'var(--primary)', height: '100%', borderRadius: '4px' }} 
            />
          </div>
        </div>
        <div className="card glass-panel" style={{ borderLeft: '4px solid var(--warning)' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Points</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>⭐ {points}</p>
        </div>
      </motion.div>

      {/* Earned Badges Section */}
      {achievements.length > 0 && (
        <motion.div variants={itemVariants} className="card glass-panel" style={{ marginBottom: '2rem', border: '1px solid var(--warning)' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             🏆 Unlocked Achievements
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {achievements.map(badge => (
              <motion.div 
                key={badge.id} 
                whileHover={{ scale: 1.05 }}
                title={badge.description}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-color)', 
                  padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--warning)' 
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{badge.icon}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{badge.title}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Today's Habits Section */}
      <motion.div variants={itemVariants} className="card glass-panel">
        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          Today's Habits ({format(today, 'MMM do')})
        </h3>
        {habitsDueToday.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No habits tracked yet. Head to the Habits tab to add one!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {habitsDueToday.map(habit => {
              const isCompleted = habit.completedDates.includes(todayStr);
              return (
                <motion.div 
                  layout
                  key={habit.id} 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)',
                    border: isCompleted ? '1px solid var(--success)' : '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h4 style={{ fontWeight: '500', textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)' }}>{habit.name}</h4>
                      {habit.streak > 2 && <span className="badge">🔥 {habit.streak}</span>}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{habit.description}</p>
                  </div>
                  <button 
                    onClick={() => toggleComplete(habit.id, todayStr)}
                    className={`btn ${isCompleted ? 'btn-success' : 'btn-primary'}`}
                    style={{ minWidth: '110px' }}
                  >
                    {isCompleted ? 'Completed' : '+10 Pts'}
                  </button>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
