import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PublicRoute component prevents already-logged-in users from accessing
 * authentication forms (/login, /signup).
 * Redirects authenticated analysts directly to /dashboard.
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F4EF] flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 border-3 border-[#00A878] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-[#64748B]">Verifying session status...</span>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;
