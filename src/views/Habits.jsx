import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AiCoach from '../components/AiCoach';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } }
};

export default function Habits() {
  const { habits, addHabit, removeHabit } = useHabits();
  const [showAdd, setShowAdd] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', description: '', frequency: 'daily', startDate: new Date().toISOString().split('T')[0] });

  const handleSubmit = (e) => {
    e.preventDefault();
    addHabit(newHabit);
    setShowAdd(false);
    setNewHabit({ name: '', description: '', frequency: 'daily', startDate: new Date().toISOString().split('T')[0] });
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="animate-fade-in">
      <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem' }}>My Habits</h2>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary" 
          onClick={() => setShowAdd(!showAdd)}
        >
        </motion.button>
      </motion.div>

      <AiCoach />

      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="card glass-panel" style={{ marginBottom: '2rem', overflow: 'hidden' }}
          >
            <h3>Create New Habit</h3>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }} onSubmit={handleSubmit}>
              <input 
                type="text" className="input-field" placeholder="Habit Name (e.g. Read 20 pages)" 
                value={newHabit.name} onChange={e => setNewHabit({...newHabit, name: e.target.value})} required 
              />
              <input 
                type="text" className="input-field" placeholder="Description (Optional)" 
                value={newHabit.description} onChange={e => setNewHabit({...newHabit, description: e.target.value})} 
              />
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <select className="input-field" style={{ flex: 1, minWidth: '150px' }} value={newHabit.frequency} onChange={e => setNewHabit({...newHabit, frequency: e.target.value})}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
                <input 
                  type="date" className="input-field" style={{ flex: 1, minWidth: '150px' }}
                  value={newHabit.startDate} onChange={e => setNewHabit({...newHabit, startDate: e.target.value})} required 
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Habit</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <AnimatePresence>
          {habits.map(habit => (
            <motion.div 
              layout
              variants={itemVariants}
              initial="hidden" animate="visible" exit="exit"
              key={habit.id} 
              className="card glass-panel" 
              style={{ position: 'relative' }}
            >
              <button 
                style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--danger)', opacity: 0.7 }} 
                onClick={() => removeHabit(habit.id)}
              >
                <Trash2 size={18} />
              </button>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', paddingRight: '2rem' }}>{habit.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{habit.description || 'No description'}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Best</p>
                  <p style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    🏆 {habit.bestStreak}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Streak</p>
                  <p style={{ fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}>
                    🔥 {habit.streak}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {habits.length === 0 && !showAdd && (
          <p style={{ color: 'var(--text-muted)' }}>You haven't added any habits yet.</p>
        )}
      </motion.div>
    </motion.div>
  );
}
