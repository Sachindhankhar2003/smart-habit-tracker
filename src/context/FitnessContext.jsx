import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { format } from 'date-fns';

const FitnessContext = createContext();

export const useFitness = () => useContext(FitnessContext);

export const FitnessProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [dailySteps, setDailySteps] = useState(() => {
    const saved = localStorage.getItem('smart_habits_fitness_v4');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('smart_habits_fitness_v4', JSON.stringify(dailySteps));
    }
  }, [dailySteps, user]);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const [todaysSteps, setTodaysSteps] = useState(dailySteps[todayStr] || 0);

  const updateSteps = (steps) => {
    const safeSteps = Math.max(0, parseInt(steps) || 0);
    setTodaysSteps(safeSteps);
    setDailySteps(prev => ({ ...prev, [todayStr]: safeSteps }));
  };

  const distance = (todaysSteps * 0.00075).toFixed(2);
  const calories = (todaysSteps * 0.04).toFixed(0);
  const activeMinutes = Math.floor(todaysSteps / 100);
  
  const stepGoal = 6000;
  const activeMinutesGoal = 90;

  const fitnessAchievements = [];
  const maxSteps = Object.values(dailySteps).reduce((a, b) => Math.max(a, b), 0);
  const totalDaysActive = Object.keys(dailySteps).length;

  if (totalDaysActive >= 1) fitnessAchievements.push({ id: 'fitness_starter', title: 'Fitness Starter', icon: '👟', description: 'Logged first fitness activity' });
  if (maxSteps >= 10000) fitnessAchievements.push({ id: '10k_steps', title: '10k Steps Day', icon: '🏃‍♂️', description: 'Reached 10,000 steps in a single day' });

  return (
    <FitnessContext.Provider value={{ 
      fitnessAchievements,
      dailySteps,
      steps: todaysSteps, 
      updateSteps, 
      distance, 
      calories, 
      activeMinutes,
      stepGoal,
      activeMinutesGoal
    }}>
      {children}
    </FitnessContext.Provider>
  );
};
