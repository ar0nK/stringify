import { createContext, useState, useEffect, useContext, useCallback } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const authHeaders = useCallback(() => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }, []);

  const hashPassword = async (password, salt) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const saltResponse = await fetch(`${apiBase}/login/GetSalt/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!saltResponse.ok) {
        const errorText = await saltResponse.text();
        return { success: false, error: errorText || 'Felhasználó nem található' };
      }

      const salt = await saltResponse.text();

      const tmpHash = await hashPassword(password, salt.replace(/"/g, ''));

      const loginResponse = await fetch(`${apiBase}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          tmpHash: tmpHash
        })
      });

      if (!loginResponse.ok) {
        const errorText = await loginResponse.text();
        return { success: false, error: errorText || 'Hibás email vagy jelszó' };
      }

      const data = await loginResponse.json();

      localStorage.setItem('authToken', data.token);
      const userData = {
        name: data.name,
        email: data.email,
        permission: data.permission
      };
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, name: data.name };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Nem sikerült csatlakozni a szerverhez' };
    }
  };

  const register = async (nev, email, telefonszam, jelszo) => {
    try {
      const response = await fetch(`${apiBase}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nev,
          email,
          telefonszam,
          jelszo
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: errorText || 'Regisztráció sikertelen' };
      }

      const message = await response.text();
      return { success: true, message };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Nem sikerült csatlakozni a szerverhez' };
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      try {
        await fetch(`${apiBase}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    apiBase,
    authHeaders
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};