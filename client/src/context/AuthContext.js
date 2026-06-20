import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [email, setEmail] = useState(localStorage.getItem('email') || null);

  const login = (authToken, userRole, userEmail) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('role', userRole);
    localStorage.setItem('email', userEmail);
    setToken(authToken);
    setRole(userRole);
    setEmail(userEmail);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    setToken(null);
    setRole(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
