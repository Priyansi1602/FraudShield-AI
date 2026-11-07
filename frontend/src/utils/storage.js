/**
 * Browser storage utility for token and user session management.
 * Abstracts local storage operations to make the application storage-agnostic.
 */

const TOKEN_KEY = 'fs_token';
const USER_KEY = 'fs_user';

export const storage = {
  // Token Operations
  saveToken: (token, rememberMe = false) => {
    if (token) {
      if (rememberMe) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem('fs_remember_me', 'true');
        sessionStorage.removeItem(TOKEN_KEY);
      } else {
        sessionStorage.setItem(TOKEN_KEY, token);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('fs_remember_me');
      }
    }
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  },

  // User Data Operations
  saveUser: (user, rememberMe = false) => {
    if (user) {
      if (rememberMe) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        sessionStorage.removeItem(USER_KEY);
      } else {
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
        localStorage.removeItem(USER_KEY);
      }
    }
  },

  getUser: () => {
    const userStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Failed to parse user data from storage:', e);
      storage.clearSession();
      return null;
    }
  },

  removeUser: () => {
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
  },

  // Clear Session
  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('fs_remember_me');
    localStorage.removeItem('fs_userEmail');
    localStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }
};
