import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const decodeJwt = (token) => {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [role, setRole] = useState(() => localStorage.getItem('auth_role'));

  useEffect(() => {
    if (!token) return;
    const claims = decodeJwt(token);
    if (!claims || !claims.exp) return;
    const expMs = claims.exp * 1000;
    const now = Date.now();
    if (expMs <= now) {
      logout();
      return;
    }
    const timeout = setTimeout(() => logout(), expMs - now);
    return () => clearTimeout(timeout);
  }, [token]);

  const login = (t, r) => {
    localStorage.setItem('auth_token', t);
    localStorage.setItem('auth_role', r);
    setToken(t);
    setRole(r);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_role');
    setToken(null);
    setRole(null);
    window.location.href = '/login';
  };

  const hasRole = (roles) => {
    if (!roles || roles.length === 0) return true;
    if (!role) return false;
    return roles.includes(role);
  };

  const value = useMemo(() => ({ token, role, login, logout, hasRole }), [token, role]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);