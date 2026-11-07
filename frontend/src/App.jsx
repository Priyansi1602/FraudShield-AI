import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import Scan from './pages/Scan';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PredictionDetail from './pages/PredictionDetail';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Base Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Public Routes protected against authenticated sessions */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Protected Console Workspace Routes wrapped inside AppLayout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/history" element={<History />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/prediction/:id" element={<PredictionDetail />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;