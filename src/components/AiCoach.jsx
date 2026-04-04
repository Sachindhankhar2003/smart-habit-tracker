import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Plus, Check, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function AiCoach() {
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [errorText, setErrorText] = useState('');
  
  const { addHabit, habits } = useHabits();
  const [addedHabits, setAddedHabits] = useState([]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!goal.trim() || isLoading) return;

    setErrorText('');
    setSuggestions([]);
    setIsLoading(true);
    
    // Check environment variable first, then fallback to localStorage if they still want to use Settings
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key');
    
    if (!apiKey) {
      setErrorText("Missing VITE_GEMINI_API_KEY in your .env file or Settings.");
      setIsLoading(false);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Suggest 5 simple daily habits that can help achieve this goal: ${goal}. Return short actionable habits.
You MUST output your response purely as a JSON Array without any markdown formatting wrappers or extra text.
Format example: [{"name": "Walk 6000 steps daily", "description": "Start by walking 6000 steps every day."}]`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();
      
      // Clean up the text in case the AI ignored instructions and added markdown codeblocks
      if (text.startsWith('```json')) text = text.replace('```json', '');
      if (text.startsWith('```')) text = text.replace('```', '');
      if (text.endsWith('```')) text = text.slice(0, -3);
      
      let parsedSuggestions = [];
      try {
        parsedSuggestions = JSON.parse(text.trim());
      } catch(e) {
        console.error("Parse fail", e, text);
        setErrorText("The AI returned a malformed suggestion list. Please try again.");
      }

      setSuggestions(parsedSuggestions);
    } catch (error) {
      console.error(error);
      setErrorText(`Connection Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
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
        <h3 style={{ margin: 0, fontWeight: '800', fontSize: '1.25rem' }}>AI Habit Coach</h3>
      </div>
      
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
        Tell me your goal, and I'll generate 5 powerful daily habits to help you reach it!
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
          {isLoading ? <Loader2 className="spinner" size={18} /> : <Sparkles size={18} />}
          <span style={{ marginLeft: '0.5rem' }}>Generate</span>
        </button>
      </form>

      {errorText && (
        <div style={{ backgroundColor: 'rgba(255, 69, 58, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          {errorText}
        </div>
      )}

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
