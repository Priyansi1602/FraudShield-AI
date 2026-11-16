import axios from 'axios';
import { storage } from '../utils/storage';

// Define the API Base URL pointing to the Flask server
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create the unified Axios instance with cookie credentials support
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
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

// Axios Response Interceptor: Capture HTTP 401 and 403 responses to automatically invalidate expired sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        console.warn('Session expired, revoked, or unauthorized (401). Invalidating local session.');
        storage.clearSession();
        
        // Prevent redirect loops on public pages
        const currentPath = window.location.pathname;
        const isPublicPath = currentPath === '/' || currentPath === '/login' || currentPath === '/signup';
        if (!isPublicPath) {
          window.location.href = '/login?expired=true';
        }
      } else if (status === 403) {
        console.warn('Access forbidden (403): insufficient privileges.');
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  /**
   * Log in user, verify credentials, and save the session token.
   */
  login: async (email, password, rememberMe = true) => {
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

      storage.saveToken(token, true);
      storage.saveUser(user, true);

      return { token, user };
    } catch (error) {
      throw error.response?.data?.message ? new Error(error.response.data.message) : error;
    }
  },

  /**
   * Terminate user session server-side, revoke token, clear cookies, and wipe local storage.
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.warn('Backend logout endpoint notification warning:', e);
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
   * Check if user is authenticated based on existence of a valid token.
   */
  isAuthenticated: () => {
    const token = storage.getToken();
    return !!token;
  }
};

export { api };
export default authService;
