import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { storage } from '../utils/storage';

// Create the authentication context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount using the auth service layer
  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (import.meta.env.DEV) {
          const rememberMe = localStorage.getItem('fs_remember_me') === 'true';
          if (!rememberMe) {
            storage.clearSession();
          }
        }

        const currentUser = authService.getCurrentUser();
        const authenticated = authService.isAuthenticated();
        
        if (currentUser && authenticated) {
          setUser(currentUser);
        } else {
          // If storage is corrupted or in an inconsistent state, reset session
          authService.logout();
        }
      } catch (error) {
        console.error('Failed to initialize session authentication context:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login action handler.
   */
  const login = async (email, password, rememberMe = false) => {
    const response = await authService.login(email, password, rememberMe);
    setUser(response.user);
    return response;
  };

  /**
   * Signup action handler.
   */
  const signup = async (fullName, email, password) => {
    const response = await authService.signup(fullName, email, password);
    setUser(response.user);
    return response;
  };

  /**
   * Logout action handler.
   */
  const logout = async () => {
    await authService.logout();
    setUser(null);
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
