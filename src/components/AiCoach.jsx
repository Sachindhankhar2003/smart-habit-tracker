import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Plus, Check } from 'lucide-react';

export default function AiCoach() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: "Hi! I'm your AI Habit Coach. Tell me your goals (e.g., 'I want to be fit' or 'I want to be productive')."}
  ]);
  const { addHabit, habits } = useHabits();
  const [addedHabits, setAddedHabits] = useState([]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const newMsgs = [...messages, { id: Date.now(), type: 'user', text: query }];
    setMessages(newMsgs);
    setQuery('');

    // Mock AI delay
    setTimeout(() => {
      const lowerQ = query.toLowerCase();
      let suggestions = [];
      let responseText = "Here are some great habits to help you reach that goal:";

      if (lowerQ.includes('fit') || lowerQ.includes('health') || lowerQ.includes('lose') || lowerQ.includes('step')) {
        suggestions = [
          { name: 'Walk 6000 steps', frequency: 'daily', description: 'Daily step goal for better health.' },
          { name: 'Drink more water', frequency: 'daily', description: 'Stay hydrated (at least 8 glasses).' },
          { name: 'Exercise 30 mins', frequency: 'daily', description: 'Any physical activity for 30 minutes.' }
        ];
      } else if (lowerQ.includes('productiv') || lowerQ.includes('work') || lowerQ.includes('focus') || lowerQ.includes('read')) {
        suggestions = [
          { name: 'Read daily', frequency: 'daily', description: 'Read 10 pages of a book.' },
          { name: 'Plan tomorrow', frequency: 'daily', description: 'Write down top 3 tasks for the next day.' },
          { name: 'Deep work block', frequency: 'daily', description: '1 hour of uninterrupted work.' }
        ];
      } else {
        responseText = "I can definitely help with that. Start with these foundational habits:";
        suggestions = [
           { name: 'Morning Routine', frequency: 'daily', description: 'Wake up at the same time every day.' },
           { name: '10 Min Meditation', frequency: 'daily', description: 'Clear your mind and reduce stress.' }
        ];
      }

      setMessages([...newMsgs, { id: Date.now()+1, type: 'bot', text: responseText, suggestions }]);
    }, 800);
  };

  const handleAdd = (suggestion) => {
    addHabit({
      name: suggestion.name,
      description: suggestion.description,
      frequency: suggestion.frequency,
      startDate: new Date().toISOString().split('T')[0]
    });
    setAddedHabits(prev => [...prev, suggestion.name]);
  };

  return (
    <div className="card glass-panel" style={{ marginBottom: '2rem', border: '1px solid var(--primary-glow)', boxShadow: '0 8px 32px var(--primary-glow)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <Bot size={24} color="var(--primary)" />
        <h3 style={{ margin: 0, fontWeight: '700' }}>AI Habit Coach</h3>
      </div>
      
      <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem', paddingRight: '0.5rem' }}>
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              style={{
                alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.type === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: msg.type === 'user' ? '#fff' : 'var(--text-main)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                maxWidth: '85%',
                border: msg.type === 'user' ? 'none' : '1px solid var(--border-color)'
              }}
            >
              <p style={{ margin: 0, fontSize: '0.875rem' }}>{msg.text}</p>
              
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                  {msg.suggestions.map((s, i) => {
                    const isAdded = habits.some(h => h.name === s.name) || addedHabits.includes(s.name);
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-color)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                        <div>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{s.name}</span>
                        </div>
                        <button 
                          onClick={() => handleAdd(s)}
                          disabled={isAdded}
                          style={{ 
                            background: isAdded ? 'transparent' : 'var(--primary)', 
                            color: isAdded ? 'var(--success)' : '#fff',
                            border: isAdded ? '1px solid var(--success)' : 'none',
                            borderRadius: '4px', padding: '0.25rem 0.5rem', fontSize: '0.75rem',
                            cursor: isAdded ? 'default' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.25rem',
                            transition: 'all 0.2s'
                          }}
                        >
                          {isAdded ? <><Check size={14}/> Added</> : <><Plus size={14}/> Add</>}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ask for advice..." 
          className="input-field"
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '0 1rem' }}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
