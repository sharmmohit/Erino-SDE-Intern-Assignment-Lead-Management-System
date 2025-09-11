import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/auth/me', { withCredentials: true });
      setCurrentUser(response.data);
    } catch (error) {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    const response = await axios.post('/api/auth/register', userData, { withCredentials: true });
    setCurrentUser(response.data.user);
    return response.data;
  };

  const login = async (credentials) => {
    const response = await axios.post('/api/auth/login', credentials, { withCredentials: true });
    setCurrentUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    register,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};