import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [userPaginationSize, setPaginationSize] = useState(10); // Default value
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndSetState = async () => {
      const access = localStorage.getItem('access');
      const refresh = localStorage.getItem('refresh');
      const storedUser = localStorage.getItem('user');
      if (access && refresh && storedUser) {
        const userData = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setUser(userData);
        setAccess(access);
        setRefresh(refresh);
        console.log('User is authenticated');
      } else {
        console.log('User is not authenticated');
      }
      setLoading(false);
    }
  
    fetchUserAndSetState();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    
    setIsAuthenticated(false);
    setUser(null);
    setAccess(null);
    setRefresh(null);

    navigate('/login');
  }, [navigate]);

  const contextValue = useMemo(() => ({
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    access,
    setAccess,
    refresh,
    setRefresh,
    logout,
    userPaginationSize,
    setPaginationSize,
    loading,
  }), [isAuthenticated, setIsAuthenticated, user, setUser, access, setAccess, refresh, setRefresh, logout, userPaginationSize, setPaginationSize, loading]);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    );
  }
};
