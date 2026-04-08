import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { format } from 'date-fns';

const API_BASE = '/api/habits';

const HabitContext = createContext();

export const useHabits = () => useContext(HabitContext);

export const HabitProvider = ({ children }) => {
  const { user } = useAuth();
  
  // State for Habits
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for Gamification Points (derived from completed habits)
  const [points, setPoints] = useState(() => {
    const savedPoints = localStorage.getItem('smart_habits_points_v2');
    return savedPoints ? parseInt(savedPoints, 10) : 0;
  });

  // Save points to localStorage (still client-side gamification)
  useEffect(() => {
    if (user) {
      localStorage.setItem('smart_habits_points_v2', points.toString());
    }
  }, [points, user]);

  // Fetch habits from backend on mount / user change
  const fetchHabits = useCallback(async () => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}?userId=${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch habits');

      const data = await res.json();
      // Map MongoDB _id to id for frontend compatibility
      const mapped = data.map(h => ({
        ...h,
        id: h._id
      }));
      setHabits(mapped);
    } catch (error) {
      console.error('Error fetching habits:', error);
      // Fallback to localStorage if backend is unreachable
      const savedHabits = localStorage.getItem('smart_habits_data_v2');
      if (savedHabits) setHabits(JSON.parse(savedHabits));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const addHabit = async (habit) => {
    const newHabitData = {
      name: habit.name,
      description: habit.description || '',
      frequency: habit.frequency || 'daily',
      startDate: habit.startDate || new Date().toISOString().split('T')[0],
      userId: user?.id || 'default_user'
    };

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHabitData)
      });

      if (!res.ok) throw new Error('Failed to create habit');

      const created = await res.json();
      const mapped = {
        ...created,
        id: created._id
      };
      setHabits(prev => [mapped, ...prev]);
    } catch (error) {
      console.error('Error creating habit:', error);
      // Fallback: add locally
      const fallback = {
        ...newHabitData,
        id: 'habit_' + Date.now(),
        createdAt: new Date().toISOString(),
        completedDates: [],
        streak: 0,
        bestStreak: 0,
      };
      setHabits(prev => [fallback, ...prev]);
    }
  };

  const removeHabit = async (id) => {
    // Optimistic update
    setHabits(prev => prev.filter(h => h.id !== id));

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete habit');
    } catch (error) {
      console.error('Error deleting habit:', error);
      // Refetch to restore state if delete failed
      fetchHabits();
    }
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

  const toggleComplete = async (id, dateStr) => {
    // Find the habit to toggle
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

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

    const updatedFields = {
      completedDates: newDates,
      streak: newStreak,
      bestStreak: newBestStreak
    };

    // Optimistic update
    setHabits(prevHabits => prevHabits.map(h => {
      if (h.id === id) {
        return { ...h, ...updatedFields };
      }
      return h;
    }));

    // Persist to backend
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (!res.ok) throw new Error('Failed to update habit');
    } catch (error) {
      console.error('Error updating habit:', error);
      // Refetch to restore correct state
      fetchHabits();
    }
  };

  // Badges calculation logic
  const achievements = [];
  const totalCompleted = habits.reduce((acc, h) => acc + (h.completedDates?.length || 0), 0);
  const highestStreak = habits.reduce((acc, h) => Math.max(acc, h.bestStreak || 0), 0);

  const level = Math.floor(points / 50) + 1;

  if (totalCompleted > 0) achievements.push({ id: 'first_habit', title: 'First Steps', icon: '🌟', description: 'Completed your first habit' });
  if (highestStreak >= 3) achievements.push({ id: '3_days', title: 'Getting Warmer', icon: '🔥', description: 'Reached a 3 day streak' });
  if (highestStreak >= 7) achievements.push({ id: '7_days', title: 'On Fire', icon: '🚀', description: 'Reached a 7 day streak' });
  if (highestStreak >= 30) achievements.push({ id: '30_days', title: 'Unstoppable', icon: '💎', description: 'Reached a 30 day streak' });
  if (level >= 10) achievements.push({ id: 'master', title: 'Habit Master', icon: '👑', description: 'Reached Level 10' });

  return (
    <HabitContext.Provider value={{ habits, loading, points, level, achievements, addHabit, removeHabit, toggleComplete }}>
      {children}
    </HabitContext.Provider>
  );
};
