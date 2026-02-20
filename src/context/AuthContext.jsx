import { createContext, useState, useEffect, useContext, useCallback } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const GUEST_CART_KEY = 'cart_guest';

  const authHeaders = useCallback(() => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }, []);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setFavoritesCount(0);
    setCartItems([]);
  }, []);

  const hashPassword = async (password, salt) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const loadGuestCart = useCallback(() => {
    try {
      const raw = localStorage.getItem(GUEST_CART_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(i => ({
        productId: Number(i.productId),
        title: i.title || '',
        price: Number(i.price) || 0,
        image: i.image || '',
        isAvailable: i.isAvailable ?? true,
        quantity: Math.max(1, Number(i.quantity) || 1),
      }));
    } catch {
      return [];
    }
  }, []);

  const saveGuestCart = useCallback((items) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  }, []);

  const fetchCartFromServer = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return [];
    const res = await fetch(`${apiBase}/api/Cart`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    if (res.status === 401) { handleUnauthorized(); return []; }
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items || []).map(i => ({
      productId: Number(i.productId),
      title: i.title,
      price: Number(i.price) || 0,
      image: i.image || '',
      isAvailable: i.isAvailable ?? true,
      quantity: Number(i.quantity) || 1,
    }));
  }, [apiBase, handleUnauthorized]);

  const fetchFavoritesCount = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    try {
      const res = await fetch(`${apiBase}/api/KedvencTermek`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) { handleUnauthorized(); return; }
      if (res.ok) {
        const data = await res.json();
        setFavoritesCount(data.length);
      }
    } catch (e) {
      console.error('Failed to fetch favorites count:', e);
    }
  }, [apiBase, handleUnauthorized]);

  const refreshCart = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setCartItems(await fetchCartFromServer());
      return;
    }
    setCartItems(loadGuestCart());
  }, [fetchCartFromServer, loadGuestCart]);

  const addToCart = useCallback(async (product, qty = 1) => {
    const productId = Number(product.id ?? product.productId);
    const quantity = Math.max(1, Number(qty) || 1);
    const token = localStorage.getItem('authToken');

    if (token) {
      const res = await fetch(`${apiBase}/api/Cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ termekId: productId, quantity })
      });
      if (res.status === 401) { handleUnauthorized(); return; }
      setCartItems(await fetchCartFromServer());
      return;
    }

    setCartItems(prev => {
      const next = [...prev];
      const idx = next.findIndex(i => i.productId === productId);
      if (idx >= 0) {
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
      } else {
        next.push({
          productId,
          title: product.title || product.nev || '',
          price: Number(product.price ?? product.ar) || 0,
          image: (product.images?.[0] ?? product.image ?? ''),
          isAvailable: product.isAvailable ?? product.elerheto ?? true,
          quantity,
        });
      }
      saveGuestCart(next);
      return next;
    });
  }, [apiBase, fetchCartFromServer, saveGuestCart, handleUnauthorized]);

  const updateCartQuantity = useCallback(async (productId, quantity) => {
    const pid = Number(productId);
    const qty = Math.max(0, Number(quantity) || 0);
    const token = localStorage.getItem('authToken');

    if (token) {
      const res = await fetch(`${apiBase}/api/Cart/set`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ termekId: pid, quantity: qty })
      });
      if (res.status === 401) { handleUnauthorized(); return; }
      setCartItems(await fetchCartFromServer());
      return;
    }

    setCartItems(prev => {
      const next = prev
        .map(i => i.productId === pid ? { ...i, quantity: qty } : i)
        .filter(i => i.quantity > 0);
      saveGuestCart(next);
      return next;
    });
  }, [apiBase, fetchCartFromServer, saveGuestCart, handleUnauthorized]);

  const removeFromCart = useCallback(async (productId) => {
    const pid = Number(productId);
    const token = localStorage.getItem('authToken');

    if (token) {
      const res = await fetch(`${apiBase}/api/Cart/remove/product/${pid}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) { handleUnauthorized(); return; }
      setCartItems(await fetchCartFromServer());
      return;
    }

    setCartItems(prev => {
      const next = prev.filter(i => i.productId !== pid);
      saveGuestCart(next);
      return next;
    });
  }, [apiBase, fetchCartFromServer, saveGuestCart, handleUnauthorized]);

  const clearCart = useCallback(async () => {
    const token = localStorage.getItem('authToken');

    if (token) {
      const res = await fetch(`${apiBase}/api/Cart/clear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) { handleUnauthorized(); return; }
      setCartItems(await fetchCartFromServer());
      return;
    }

    localStorage.removeItem(GUEST_CART_KEY);
    setCartItems([]);
  }, [apiBase, fetchCartFromServer, handleUnauthorized]);

  const cartCount = cartItems.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        fetchFavoritesCount();
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        handleUnauthorized();
      }
    }

    setLoading(false);
  }, [fetchFavoritesCount, handleUnauthorized]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const login = async (email, password) => {
    try {
      const saltResponse = await fetch(`${apiBase}/login/GetSalt/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!saltResponse.ok) {
        const errorText = await saltResponse.text();
        return { success: false, error: errorText || 'Felhasználó nem található' };
      }

      const salt = await saltResponse.text();
      const tmpHash = await hashPassword(password, salt.replace(/"/g, ''));

      const loginResponse = await fetch(`${apiBase}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tmpHash })
      });

      if (!loginResponse.ok) {
        const errorText = await loginResponse.text();
        return { success: false, error: errorText || 'Hibás email vagy jelszó' };
      }

      const data = await loginResponse.json();

      localStorage.setItem('authToken', data.token);
      const userData = { name: data.name, email: data.email, permission: data.permission };
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
      fetchFavoritesCount();
      await refreshCart();

      return { success: true, name: data.name };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Nem sikerült csatlakozni a szerverhez' };
    }
  };

  const register = async (nev, email, jelszo) => {
    try {
      const response = await fetch(`${apiBase}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nev, email, jelszo })
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    handleUnauthorized();
    setCartItems(loadGuestCart());
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    apiBase,
    authHeaders,
    favoritesCount,
    setFavoritesCount,
    fetchFavoritesCount,
    cartItems,
    cartCount,
    refreshCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};