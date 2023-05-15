import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const access = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');
    const storedUser = localStorage.getItem('user');
    
    if (access && refresh && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
      setToken({ access, refresh });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
