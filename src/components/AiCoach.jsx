import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Plus, Check, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function AiCoach() {
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: "Hi! I'm your AI Habit Coach. Ask me anything about health, productivity, or setting goals!"}
  ]);
  const { addHabit, habits } = useHabits();
  const [addedHabits, setAddedHabits] = useState([]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim() || isTyping) return;

    const userText = query;
    const newMsgs = [...messages, { id: Date.now(), type: 'user', text: userText }];
    setMessages(newMsgs);
    setQuery('');
    
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      setTimeout(() => {
        setMessages(m => [...m, { 
          id: Date.now()+1, type: 'bot', 
          text: 'I am currently in basic mock mode. To unlock my full conversational abilities so I can answer normally and give custom advice, please enter your free Gemini API Key in the Settings tab!', 
          suggestions: [] 
        }]);
      }, 500);
      return;
    }

    setIsTyping(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are a friendly, expert AI Habit and Fitness Coach. 
The user says: "${userText}"
If they are asking a normal question, answer them conversationally and naturally like a real coach (don't over-format).
If they are asking for advice or it's appropriate to suggest new habits for them to track in the app, append a JSON block at the very end of your response starting with \`\`\`json.
The JSON block MUST be a strict Array of objects: [{"name": "Habit Name", "description": "Short description", "frequency": "daily"}]. 
Only include the JSON if you are suggesting habits for them to add. Keep your text response concise.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      let suggestions = [];
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        try {
          suggestions = JSON.parse(jsonMatch[1]);
          text = text.replace(jsonMatch[0], '').trim();
        } catch(e) {
          console.error("Failed to parse AI suggestions", e);
        }
      }

      setMessages(m => [...m, { id: Date.now()+1, type: 'bot', text, suggestions }]);
    } catch (error) {
      console.error(error);
      setMessages(m => [...m, { id: Date.now()+1, type: 'bot', text: "Oops, I encountered an error connecting to my brain. Please check if your API Key in Settings is valid, or try again.", suggestions: [] }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAdd = (suggestion) => {
    addHabit({
      name: suggestion.name,
      description: suggestion.description,
      frequency: suggestion.frequency || 'daily',
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
      
      <div style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem', paddingRight: '0.5rem' }}>
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
              <p style={{ margin: 0, fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                  {msg.suggestions.map((s, i) => {
                    const isAdded = habits.some(h => h.name === s.name) || addedHabits.includes(s.name);
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-color)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                        <div>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{s.name}</span>
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
          {isTyping && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignSelf: 'flex-start', color: 'var(--text-muted)' }}>
               <Loader2 className="spinner" size={20} />
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ask a question or request advice..." 
          className="input-field"
          disabled={isTyping}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
        />
        <button type="submit" disabled={isTyping || !query.trim()} className="btn btn-primary" style={{ padding: '0 1rem' }}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
