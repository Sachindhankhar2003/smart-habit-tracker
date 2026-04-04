import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HabitProvider } from './context/HabitContext';
import { FitnessProvider } from './context/FitnessContext';

import Layout from './components/Layout';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Habits from './views/Habits';
import Analytics from './views/Analytics';
import Fitness from './views/Fitness';
import Settings from './views/Settings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <HabitProvider>
          <FitnessProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="habits" element={<Habits />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="fitness" element={<Fitness />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </FitnessProvider>
        </HabitProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
