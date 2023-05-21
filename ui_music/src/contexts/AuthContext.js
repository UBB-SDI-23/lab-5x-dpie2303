import { createContext } from 'react';

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {},
  access: null,
  setAccess: () => {},
  refresh: null,
  setRefresh: () => {},
  logout: () => {},
  userPaginationSize: 10, 
  setPaginationSize: () => {},
});