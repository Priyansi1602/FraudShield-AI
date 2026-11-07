import axios from 'axios';
import { storage } from '../utils/storage';

// Define the API Base URL pointing to the Flask server
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create the unified Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Request Interceptor: Attach the JWT token dynamically to every secure request
api.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios Response Interceptor: Capture HTTP 401 responses to automatically invalidate expired sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Authentication token expired or invalid. Automatic logout triggered.');
      storage.clearSession();
      // Force page refresh to trigger AuthContext re-check and route redirect to /login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  /**
   * Log in user, verify credentials, and save the session token.
   */
  login: async (email, password, rememberMe = false) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      storage.saveToken(token, rememberMe);
      storage.saveUser(user, rememberMe);

      return { token, user };
    } catch (error) {
      throw error.response?.data?.message ? new Error(error.response.data.message) : error;
    }
  },

  /**
   * Register a new user and initialize a new authenticated session.
   */
  signup: async (fullName, email, password) => {
    try {
      const response = await api.post('/auth/signup', { fullName, email, password });
      const { token, user } = response.data;

      storage.saveToken(token, false);
      storage.saveUser(user, false);

      return { token, user };
    } catch (error) {
      throw error.response?.data?.message ? new Error(error.response.data.message) : error;
    }
  },

  /**
   * Terminate user session and remove tokens.
   */
  logout: async () => {
    try {
      // Optional backend endpoint notify
      // await api.post('/auth/logout');
    } catch (e) {
      console.warn('Backend logout notification failed', e);
    } finally {
      storage.clearSession();
    }
  },

  /**
   * Fetch currently logged in profile directly from backend using JWT token validation.
   */
  fetchCurrentUserProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data.user;
    } catch (error) {
      throw error.response?.data?.message ? new Error(error.response.data.message) : error;
    }
  },

  /**
   * Get active logged in user details from local storage cache.
   */
  getCurrentUser: () => {
    return storage.getUser();
  },

  /**
   * Check if user is authenticated based on existence of a valid JWT token.
   */
  isAuthenticated: () => {
    const token = storage.getToken();
    return !!token;
  }
};

export { api };
export default authService;
