import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const authHeaders = (extra = {}) => ({
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  const login = async (loginName, jelszo) => {
    try {
      const saltRes = await fetch(`${API_BASE}/Login/GetSalt/${encodeURIComponent(loginName)}`, {
        method: 'GET',
      });

      if (!saltRes.ok) {
        const text = await saltRes.text();
        throw new Error(text || 'Felhasználó nem található');
      }

      const salt = await saltRes.text();
      const tmpHash = await sha256(jelszo + salt);

      const loginRes = await fetch(`${API_BASE}/Login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginName: loginName,
          tmpHash: tmpHash,
        }),
      });

      if (!loginRes.ok) {
        const text = await loginRes.text();
        throw new Error(text || 'Bejelentkezési hiba');
      }

      const data = await loginRes.json();

      setToken(data.token);
      const u = {
        name: data.name,
        email: data.email,
        permission: data.permission,
      };
      setUser(u);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(u));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (nev, email, telefonszam, jelszo) => {
    try {
      const res = await fetch(`${API_BASE}/Register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nev, email, telefonszam, jelszo }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Regisztrációs hiba');
      }

      const text = await res.text();
      return { success: true, message: text };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE}/Logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const sha256 = async (message) => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
    apiBase: API_BASE,
    authHeaders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
