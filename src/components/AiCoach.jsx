import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Plus, Check, Sparkles } from 'lucide-react';

export default function AiCoach() {
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const { addHabit, habits } = useHabits();
  const [addedHabits, setAddedHabits] = useState([]);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!goal.trim() || isLoading) return;

    setSuggestions([]);
    setIsLoading(true);
    
    // Offline Heuristic Engine matched to original Gemini Prompt specs
    const g = goal.toLowerCase();
    let newSuggestions = [];

    if (g.includes('health') || g.includes('weight') || g.includes('fit') || g.includes('active')) {
      newSuggestions = [
        { name: "Walk 6000 steps daily", description: "Hit your daily step goal using motion sensors." },
        { name: "Drink 2 liters of water", description: "Stay hydrated throughout the day." },
        { name: "Exercise for 30 minutes", description: "Elevate your heart rate safely." },
        { name: "Sleep before 11 PM", description: "Get proper rest for physical recovery." },
        { name: "Eat fruits daily", description: "Add essential vitamins and fiber to your diet." }
      ];
    } else if (g.includes('productiv') || g.includes('focus') || g.includes('work') || g.includes('study')) {
      newSuggestions = [
        { name: "Plan tomorrow tonight", description: "Write top 3 high-impact tasks for the next day." },
        { name: "No phone first hour", description: "Stay off screens immediately after waking up." },
        { name: "Pomodoro blocks", description: "Work in intense 25-minute focused intervals." },
        { name: "Read 10 pages", description: "Daily concentrated reading to expand knowledge." },
        { name: "Inbox Zero", description: "Process and organize all communications daily." }
      ];
    } else if (g.includes('mind') || g.includes('stress') || g.includes('calm') || g.includes('happy')) {
      newSuggestions = [
        { name: "10 min Meditation", description: "Clear your mind and practice mindfulness daily." },
        { name: "Journaling", description: "Write down your unfiltered thoughts in the evening." },
        { name: "Daily gratitude", description: "Physically list 3 unique things you are grateful for." },
        { name: "Stretch", description: "Relieve accumulated physical tension." },
        { name: "Digital detox", description: "Spend 1 hour without any glowing screens." }
      ];
    } else {
      newSuggestions = [
        { name: "Read daily", description: "Read a physical book for at least 15 minutes." },
        { name: "Hydrate", description: "Drink a glass of water immediately upon waking." },
        { name: "Review goals", description: "Remind yourself actively of your priorities." },
        { name: "Reflect", description: "Review what went well today." },
        { name: "Sleep 8 hours", description: "Prioritize consistent, uninterrupted rest patterns." }
      ];
    }

    // Simulate AI processing delay for satisfying UX
    setTimeout(() => {
      setSuggestions(newSuggestions);
      setIsLoading(false);
    }, 600);
  };

  const handleAddHabit = (suggestion) => {
    addHabit({
      name: suggestion.name,
      description: suggestion.description,
      frequency: 'daily',
      startDate: new Date().toISOString().split('T')[0]
    });
    setAddedHabits(prev => [...prev, suggestion.name]);
  };

  return (
    <div className="card glass-panel" style={{ marginBottom: '2rem', border: '1px solid var(--primary-glow)', boxShadow: '0 8px 32px var(--primary-glow)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <Bot size={28} color="var(--primary)" />
        <h3 style={{ margin: 0, fontWeight: '800', fontSize: '1.25rem' }}>AI Habit Coach (Offline Mode)</h3>
      </div>
      
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
        Tell me your goal, and my offline intelligence engine will instantly generate 5 powerful daily habits to help you reach it without any internet!
      </p>

      <form onSubmit={handleGenerate} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          value={goal}
          onChange={e => setGoal(e.target.value)}
          placeholder="e.g. I want to improve my health..." 
          className="input-field"
          disabled={isLoading}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
        />
        <button type="submit" disabled={isLoading || !goal.trim()} className="btn btn-primary" style={{ padding: '0 1.25rem' }}>
          {isLoading ? <span className="spinner" style={{display: 'inline-block', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', width: '18px', height: '18px'}} /> : <Sparkles size={18} />}
          <span style={{ marginLeft: '0.5rem' }}>Generate</span>
        </button>
      </form>

      {suggestions && suggestions.length > 0 && (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}
          >
            <h4 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-main)' }}>Suggested Habits:</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {suggestions.map((s, idx) => {
                const isAdded = habits.some(h => h.name === s.name) || addedHabits.includes(s.name);
                
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ paddingRight: '1rem' }}>
                      <p style={{ margin: 0, fontWeight: '700', fontSize: '0.875rem', color: 'var(--primary)' }}>• {s.name}</p>
                      {s.description && (
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.description}</p>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => handleAddHabit(s)}
                      disabled={isAdded}
                      className={`btn ${isAdded ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ 
                        padding: '0.35rem 0.75rem', fontSize: '0.75rem', 
                        opacity: isAdded ? 0.6 : 1, minWidth: '85px',
                        justifyContent: 'center'
                      }}
                    >
                      {isAdded ? <><Check size={14}/> Added</> : <><Plus size={14}/> Track</>}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
