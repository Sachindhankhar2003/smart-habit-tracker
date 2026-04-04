import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { format } from 'date-fns';

const HabitContext = createContext();

export const useHabits = () => useContext(HabitContext);

export const HabitProvider = ({ children }) => {
  const { user } = useAuth();
  
  // State for Habits
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem('smart_habits_data_v2');
    return savedHabits ? JSON.parse(savedHabits) : [];
  });

  // State for Gamification Points
  const [points, setPoints] = useState(() => {
    const savedPoints = localStorage.getItem('smart_habits_points_v2');
    return savedPoints ? parseInt(savedPoints, 10) : 0;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('smart_habits_data_v2', JSON.stringify(habits));
      localStorage.setItem('smart_habits_points_v2', points.toString());
    }
  }, [habits, points, user]);

  const addHabit = (habit) => {
    const newHabit = {
      ...habit,
      id: 'habit_' + Date.now(),
      createdAt: new Date().toISOString(),
      completedDates: [],
      streak: 0,
      bestStreak: 0,
    };
    setHabits([...habits, newHabit]);
  };

  const removeHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const calculateStreak = (completedDates) => {
    if (!completedDates || completedDates.length === 0) return 0;
    const sorted = [...completedDates].sort((a, b) => new Date(b) - new Date(a));
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    let streak = 0;
    let currentDate = new Date(todayStr);

    if (sorted.includes(todayStr) || sorted.includes(format(new Date(currentDate.getTime() - 86400000), 'yyyy-MM-dd'))) {
      if (sorted.includes(todayStr)) streak++;
      for (let i = 0; i < sorted.length; i++) {
        if (sorted[i] === todayStr) continue;
        currentDate.setDate(currentDate.getDate() - 1);
        if (sorted.includes(format(currentDate, 'yyyy-MM-dd'))) {
          streak++;
        } else {
          break;
        }
      }
      return streak;
    }
    return 0;
  };

  const toggleComplete = (id, dateStr) => {
    setHabits(prevHabits => prevHabits.map(habit => {
      if (habit.id === id) {
        const isCompleted = habit.completedDates.includes(dateStr);
        let newDates;
        
        if (isCompleted) {
          newDates = habit.completedDates.filter(d => d !== dateStr);
          setPoints(p => Math.max(0, p - 10)); 
        } else {
          newDates = [...habit.completedDates, dateStr];
          setPoints(p => p + 10); 
        }
        
        const newStreak = calculateStreak(newDates);
        const newBestStreak = Math.max(habit.bestStreak || 0, newStreak);

        return { ...habit, completedDates: newDates, streak: newStreak, bestStreak: newBestStreak };
      }
      return habit;
    }));
  };

  // Badges calculation logic
  const achievements = [];
  const totalCompleted = habits.reduce((acc, h) => acc + h.completedDates.length, 0);
  const highestStreak = habits.reduce((acc, h) => Math.max(acc, h.bestStreak), 0);

  const level = Math.floor(points / 50) + 1;

  if (totalCompleted > 0) achievements.push({ id: 'first_habit', title: 'First Steps', icon: '🌟', description: 'Completed your first habit' });
  if (highestStreak >= 3) achievements.push({ id: '3_days', title: 'Getting Warmer', icon: '🔥', description: 'Reached a 3 day streak' });
  if (highestStreak >= 7) achievements.push({ id: '7_days', title: 'On Fire', icon: '🚀', description: 'Reached a 7 day streak' });
  if (highestStreak >= 30) achievements.push({ id: '30_days', title: 'Unstoppable', icon: '💎', description: 'Reached a 30 day streak' });
  if (level >= 10) achievements.push({ id: 'master', title: 'Habit Master', icon: '👑', description: 'Reached Level 10' });

  return (
    <HabitContext.Provider value={{ habits, points, level, achievements, addHabit, removeHabit, toggleComplete }}>
      {children}
    </HabitContext.Provider>
  );
};
