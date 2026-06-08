import { createContext, useContext, useMemo, useState } from 'react';
import { api, setAuthToken } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('atsToken'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('atsUser');
    return stored ? JSON.parse(stored) : null;
  });

  setAuthToken(token);

  const value = useMemo(
    () => ({
      user,
      loading: false,
      async login(credentials) {
        const { data } = await api.post('/auth/login', credentials);
        localStorage.setItem('atsToken', data.token);
        localStorage.setItem('atsUser', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        setAuthToken(data.token);
        return data.user;
      },
      logout() {
        localStorage.removeItem('atsToken');
        localStorage.removeItem('atsUser');
        setToken(null);
        setUser(null);
        setAuthToken(null);
      }
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
