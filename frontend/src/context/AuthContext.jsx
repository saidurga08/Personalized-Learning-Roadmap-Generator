import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { mockUser } from '../services/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const profile = await authService.getProfile();
          if (profile && profile.name) {
            setUser(profile);
            localStorage.setItem('user', JSON.stringify(profile));
          }
        } catch (error) {
          console.warn('API profile check failed, keeping stored user profile:', error);
        }
      } else if (!user) {
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
        const activeUser = data.user || {
          ...mockUser,
          email: email,
          name: email.split('@')[0].toUpperCase()
        };
        setUser(activeUser);
        localStorage.setItem('user', JSON.stringify(activeUser));
        return { success: true };
      }
    } catch (error) {
      console.warn('Backend login fallback:', error);
      const demoToken = 'demo-jwt-token-' + Date.now();
      const activeUser = {
        id: Date.now(),
        name: email.split('@')[0].toUpperCase(),
        email: email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        study_streak: 1
      };
      localStorage.setItem('token', demoToken);
      localStorage.setItem('user', JSON.stringify(activeUser));
      setToken(demoToken);
      setUser(activeUser);
      return { success: true, isDemo: true };
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await authService.register({ name, email, password });
      if (data && data.access_token) {
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
        const newUserObj = data.user || { id: Date.now(), name, email, study_streak: 1 };
        setUser(newUserObj);
        localStorage.setItem('user', JSON.stringify(newUserObj));
        return { success: true };
      }
      return login(email, password);
    } catch (error) {
      console.warn('Backend register fallback:', error);
      const demoToken = 'demo-jwt-token-' + Date.now();
      const newUserObj = {
        id: Date.now(),
        name: name || email.split('@')[0].toUpperCase(),
        email: email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        study_streak: 1
      };
      localStorage.setItem('token', demoToken);
      localStorage.setItem('user', JSON.stringify(newUserObj));
      setToken(demoToken);
      setUser(newUserObj);
      return { success: true, isDemo: true };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
