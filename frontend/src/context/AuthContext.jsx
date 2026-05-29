import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, signup as apiSignup, logout as apiLogout } from '../api/userApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // On mount, rehydrate user from stored token
  useEffect(() => {
    if (token) {
      try {
        // TODO: Optionally validate the token against your backend (e.g. GET /user/me)
        // For now we decode the JWT payload client-side for display purposes only
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) {
          handleLogout();
        } else {
          setUser({ id: payload.id, email: payload.email });
        }
      } catch {
        handleLogout();
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = useCallback(async (email, password) => {
    // TODO: This calls POST /user/login on your backend
    const result = await apiLogin(email, password);
    if (result.success) {
      localStorage.setItem('token', result.token);
      setToken(result.token);
      const payload = JSON.parse(atob(result.token.split('.')[1]));
      setUser({ id: payload.id, email: payload.email });
    }
    return result;
  }, []);

  const handleSignup = useCallback(async (email, password) => {
    // TODO: This calls POST /user/signup on your backend
    const result = await apiSignup(email, password);
    if (result.success) {
      localStorage.setItem('token', result.token);
      setToken(result.token);
      const payload = JSON.parse(atob(result.token.split('.')[1]));
      setUser({ id: payload.id, email: payload.email });
    }
    return result;
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      // TODO: This calls GET /user/logout on your backend to destroy the session
      await apiLogout();
    } catch {
      // Even if the request fails, clear local state
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
