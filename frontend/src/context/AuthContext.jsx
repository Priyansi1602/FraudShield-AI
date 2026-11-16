import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { storage } from '../utils/storage';

// Create the centralized authentication context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.getUser());
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and verify authentication state on application startup
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const storedToken = storage.getToken();
        const cachedUser = storage.getUser();

        if (storedToken && cachedUser) {
          // Optimistically restore cached analyst session
          if (isMounted) setUser(cachedUser);

          // Verify token validity & freshness against backend /api/auth/me
          try {
            const liveUser = await authService.fetchCurrentUserProfile();
            if (isMounted && liveUser) {
              setUser(liveUser);
              storage.saveUser(liveUser);
            }
          } catch (verifyErr) {
            console.warn('Session verification notice:', verifyErr.message);
            // Invalidate if token is revoked, expired, or rejected with 401
            if (
              verifyErr.response?.status === 401 ||
              verifyErr.message?.toLowerCase().includes('expired') ||
              verifyErr.message?.toLowerCase().includes('invalid') ||
              verifyErr.message?.toLowerCase().includes('revoked')
            ) {
              storage.clearSession();
              if (isMounted) setUser(null);
            }
          }
        } else {
          storage.clearSession();
          if (isMounted) setUser(null);
        }
      } catch (error) {
        console.error('Failed to initialize session authentication context:', error);
        storage.clearSession();
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initializeAuth();

    // Multi-tab synchronization: sync authentication state across browser tabs
    const handleStorageChange = (e) => {
      if (e.key === 'fs_token' || e.key === 'fs_user') {
        const activeToken = storage.getToken();
        const activeUser = storage.getUser();
        if (!activeToken || !activeUser) {
          setUser(null);
        } else {
          setUser(activeUser);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  /**
   * Centralized Login action handler.
   */
  const login = async (email, password, rememberMe = true) => {
    const response = await authService.login(email, password, rememberMe);
    setUser(response.user);
    return response;
  };

  /**
   * Centralized Signup action handler.
   */
  const signup = async (fullName, email, password) => {
    const response = await authService.signup(fullName, email, password);
    setUser(response.user);
    return response;
  };

  /**
   * Centralized Logout action handler:
   * Invalidates server-side session, clears cookies, wipes local storage, resets state.
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout notification error:', err);
    } finally {
      setUser(null);
      storage.clearSession();
    }
  };

  const value = {
    user,
    isAuthenticated: !!user && authService.isAuthenticated(),
    isLoading,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to consume the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
