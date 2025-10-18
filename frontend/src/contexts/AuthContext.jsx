import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, tokenManager } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = tokenManager.getAccessToken();
      
      // Only set user if we have a valid token AND stored user data
      if (token) {
        try {
          // Try to get stored user data
          const storedUser = localStorage.getItem('skillhub_user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // No stored user data, clear token and require login
            tokenManager.clearTokens();
            setUser(null);
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          tokenManager.clearTokens();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      // For development: accept simple test credentials
      if (username === 'admin' && password === 'admin') {
        const mockToken = 'mock-jwt-token-for-development';
        const userData = { 
          id: 1, 
          username: 'admin', 
          email: 'admin@example.com',
          authenticated: true 
        };
        
        tokenManager.setTokens(mockToken, 'mock-refresh-token');
        localStorage.setItem('skillhub_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
      }

      // Try real API login
      const response = await authAPI.login(username, password);
      const { user, access, refresh } = response.data;
      
      tokenManager.setTokens(access, refresh);
      localStorage.setItem('skillhub_user', JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      const { user, access, refresh } = response.data;
      
      tokenManager.setTokens(access, refresh);
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Signup failed' 
      };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearTokens();
      localStorage.removeItem('skillhub_user');
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
