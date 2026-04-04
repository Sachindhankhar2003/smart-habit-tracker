import React, { useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import { useFitness } from '../context/FitnessContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { format, subDays } from 'date-fns';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function Analytics() {
  const { habits, level, points } = useHabits();
  const { dailySteps } = useFitness();

  const weeklyFitnessData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const steps = dailySteps[dateStr] || 0;
      data.push({
        name: format(date, 'EEE'),
        steps: steps,
        calories: Math.round(steps * 0.04),
        activeMin: Math.floor(steps / 100),
      });
    }
    return data;
  }, [dailySteps]);

  // Generate data for the last 28 days (Monthly View)
  const monthlyData = useMemo(() => {
    const data = [];
    for (let i = 27; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      let completed = 0;
      habits.forEach(h => {
        if (h.completedDates.includes(dateStr)) completed++;
      });
      data.push({
        name: i % 7 === 0 ? format(date, 'MMM d') : '', // label roughly once a week
        date: format(date, 'MMM d'),
        completed: completed,
      });
    }
    return data;
  }, [habits]);

  // Generate best streaks data incorporating bestStreak
  const streakData = habits.map(h => ({
    name: h.name.substring(0, 10) + (h.name.length > 10 ? '...' : ''),
    streak: h.streak,
    bestStreak: h.bestStreak,
  })).sort((a,b) => b.bestStreak - a.bestStreak).slice(0, 5);

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <motion.h2 variants={itemVariants} style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Analytics & Progress</motion.h2>
      
      {habits.length === 0 ? (
        <motion.p variants={itemVariants} style={{ color: 'var(--text-muted)' }}>Not enough data yet. Complete some habits first!</motion.p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
             <div className="card glass-panel" style={{ textAlign: 'center' }}>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Current Level</p>
               <h3 style={{ fontSize: '2rem', color: 'var(--primary)' }}>{level}</h3>
             </div>
             <div className="card glass-panel" style={{ textAlign: 'center' }}>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Lifetime Points</p>
               <h3 style={{ fontSize: '2rem', color: 'var(--warning)' }}>⭐ {points}</h3>
             </div>
          </motion.div>

          <motion.div variants={itemVariants} className="card glass-panel" style={{ height: '350px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Monthly Completion Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} />
                <YAxis stroke="var(--text-muted)" allowDecimals={false} />
                <Tooltip 
                  labelFormatter={(v, payload) => payload?.[0]?.payload?.date || v}
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="completed" name="Completed" stroke="var(--primary)" fillOpacity={1} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div variants={itemVariants} className="card glass-panel" style={{ height: '350px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Streak Leaderboard</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={streakData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-muted)" allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" width={100} />
                <Tooltip 
                  cursor={{fill: 'var(--bg-color)'}}
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                />
                <Bar dataKey="bestStreak" name="Personal Best" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={16} />
                <Bar dataKey="streak" name="Current Streak" fill="var(--success)" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
          
          <motion.div variants={itemVariants} className="card glass-panel" style={{ height: '350px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Weekly Step History</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyFitnessData} margin={{ top: 5, right: 30, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} />
                <YAxis stroke="var(--text-muted)" allowDecimals={false} />
                <Tooltip 
                  cursor={{fill: 'var(--border-color)'}}
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                />
                <Bar dataKey="steps" fill="#ff453a" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="card glass-panel" style={{ height: '300px' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Active Minutes Trend</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyFitnessData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} />
                  <YAxis stroke="var(--text-muted)" allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="activeMin" stroke="#30d158" strokeWidth={3} dot={{ r: 4, fill: '#30d158', strokeWidth: 2, stroke: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="card glass-panel" style={{ height: '300px' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Calories Burned</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyFitnessData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} />
                  <YAxis stroke="var(--text-muted)" allowDecimals={false} />
                  <Tooltip cursor={{fill: 'var(--border-color)'}} contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                  <Bar dataKey="calories" fill="#0a84ff" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
        </div>
      )}
    </motion.div>
  );
}
