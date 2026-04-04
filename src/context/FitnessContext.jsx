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

  return (
    <FitnessContext.Provider value={{ 
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
