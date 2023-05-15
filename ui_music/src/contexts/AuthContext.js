import { createContext } from 'react';

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {},
  token: null,
  setToken: () => {},
  logout: () => {},
});