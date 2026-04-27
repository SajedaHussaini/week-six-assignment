import React, { createContext, useState } from 'react';
import { getUser, login as doLogin, logout as doLogout } from '../api/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser());

  function login(username, password) {
    const loggedInUser = doLogin(username, password);
    setUser(loggedInUser);
    return loggedInUser;
  }
  function logout() {
    doLogout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
