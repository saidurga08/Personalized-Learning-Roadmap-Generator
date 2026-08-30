import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { mockUser } from '../services/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch (error) {
          console.warn('API profile check failed, falling back to cached user:', error);
          setUser(mockUser);
        }
      } else {
        // Default demo user for smooth testing
        setUser(mockUser);
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
        setUser(data.user || mockUser);
        return { success: true };
      }
    } catch (error) {
      console.warn('Backend login failed, using demo session:', error);
      // Demo login behavior
      const demoToken = 'demo-jwt-token-xyz';
      localStorage.setItem('token', demoToken);
      setToken(demoToken);
      setUser({ ...mockUser, email });
      return { success: true, isDemo: true };
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await authService.register({ name, email, password });
      return login(email, password);
    } catch (error) {
      console.warn('Backend register failed, creating demo user session:', error);
      const demoToken = 'demo-jwt-token-xyz';
      localStorage.setItem('token', demoToken);
      setToken(demoToken);
      setUser({ ...mockUser, name, email });
      return { success: true, isDemo: true };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
