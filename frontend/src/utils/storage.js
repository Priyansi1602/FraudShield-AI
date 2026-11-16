/**
 * Browser storage utility for token and user session management.
 * Abstracts storage operations, guarantees persistence across refreshes and multiple browser tabs,
 * and ensures sensitive credentials (passwords) are NEVER stored in browser storage.
 */

const TOKEN_KEY = 'fs_token';
const USER_KEY = 'fs_user';
const REMEMBER_KEY = 'fs_remember_me';

export const storage = {
  /**
   * Save session JWT token across localStorage and sessionStorage for cross-tab & refresh resilience.
   * Passwords are NEVER accepted or stored.
   */
  saveToken: (token, rememberMe = true) => {
    if (!token) return;
    try {
      localStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(TOKEN_KEY, token);
      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, 'true');
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }
    } catch (e) {
      console.warn('Storage write error (fallback to sessionStorage):', e);
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  },

  /**
   * Retrieves active token from localStorage or sessionStorage.
   */
  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    } catch (e) {
      return null;
    }
  },

  /**
   * Removes tokens from all browser storage caches.
   */
  removeToken: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.warn('Storage remove error:', e);
    }
  },

  /**
   * Saves serialized analyst profile metadata. Sensitive password hashes are excluded.
   */
  saveUser: (user, rememberMe = true) => {
    if (!user) return;
    try {
      // Whitelist only safe, non-sensitive profile attributes
      const safeUser = {
        id: user.id,
        fullName: user.fullName || user.full_name || 'Fraud Analyst',
        email: user.email,
        role: user.role || 'Fraud Analyst',
        createdAt: user.createdAt || user.created_at || new Date().toISOString()
      };
      const userStr = JSON.stringify(safeUser);
      localStorage.setItem(USER_KEY, userStr);
      sessionStorage.setItem(USER_KEY, userStr);
    } catch (e) {
      console.warn('Storage save user error:', e);
    }
  },

  /**
   * Retrieves cached analyst profile from storage.
   */
  getUser: () => {
    try {
      const userStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Failed to parse cached user data from storage:', e);
      storage.clearSession();
      return null;
    }
  },

  /**
   * Removes cached user object.
   */
  removeUser: () => {
    try {
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(USER_KEY);
    } catch (e) {
      console.warn('Storage remove user error:', e);
    }
  },

  /**
   * Fully terminates the local session state across all keys.
   */
  clearSession: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(REMEMBER_KEY);
      localStorage.removeItem('fs_userEmail');
      localStorage.removeItem('isAuthenticated');
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    } catch (e) {
      console.warn('Storage clearSession error:', e);
    }
  }
};
