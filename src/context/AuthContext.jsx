import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('smart_habit_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('smart_habit_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smart_habit_user');
    }
  }, [user]);

  const login = (email, password) => {
    // Mock login, accept anything for now
    setUser({ email, name: email.split('@')[0], id: 'user_' + Date.now() });
  };

  const signup = (name, email, password) => {
    setUser({ name, email, id: 'user_' + Date.now() });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
