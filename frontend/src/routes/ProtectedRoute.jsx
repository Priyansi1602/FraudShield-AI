import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component blocks access to users who are not authenticated.
 * Displays a clean institutional loading state during session hydration.
 * Redirects unauthenticated users to the /login endpoint.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F4EF] flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 border-3 border-[#00A878] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-[#64748B]">Verifying analyst session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
