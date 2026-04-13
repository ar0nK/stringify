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
      return parsed.map(i => {
        const isCustom = Boolean(i.isCustom || i.customId || i.egyediGitarId);
        const customId = i.customId ?? i.egyediGitarId ?? null;
        const productId = isCustom ? null : Number(i.productId);
        const itemKey = i.itemKey ?? (isCustom ? `custom-${customId}` : String(productId));

        return {
          itemKey,
          isCustom,
          customId,
          productId,
          title: i.title || '',
          price: Number(i.price) || 0,
          image: i.image || '',
          isAvailable: i.isAvailable ?? true,
          quantity: Math.max(1, Number(i.quantity) || 1),
        };
      });
    } catch {
      return [];
    }
  }, []);

  const saveGuestCart = useCallback((items) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  }, []);

  const mergeCartItems = useCallback((serverItems) => {
    const localCustomItems = loadGuestCart().filter(i => i.isCustom);

    const merged = serverItems.map(item => {
      if (!item.isCustom) return item;
      const local = localCustomItems.find(l => l.customId === item.customId);
      if (!local) return item;
      return {
        ...item,
        itemKey: local.itemKey ?? item.itemKey,
        image: local.image || item.image,
      };
    });

    const missingLocal = localCustomItems.filter(l =>
      !serverItems.some(s => s.isCustom && s.customId === l.customId)
    );

    return [...merged, ...missingLocal];
  }, [loadGuestCart]);

  const fetchCartFromServer = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return [];
    try {
      const res = await fetch(`${apiBase}/api/Cart`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        handleUnauthorized();
        return [];
      }
      if (!res.ok) return [];
      const data = await res.json();
      return (data.items || []).map(i => {
        const isCustom = i.type === 'custom' || i.customGuitarId != null || i.egyediGitarId != null;
        const customId = i.customGuitarId ?? i.egyediGitarId ?? null;
        const productId = isCustom ? null : Number(i.productId);
        const itemKey = isCustom ? `custom-${customId}` : String(productId);

        return {
          itemKey,
          isCustom,
          customId,
          productId,
          title: i.title,
          price: Number(i.price) || 0,
          image: i.image || '',
          isAvailable: i.isAvailable ?? true,
          quantity: Number(i.quantity) || 1,
        };
      });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      return [];
    }
  }, [apiBase, handleUnauthorized]);

  const fetchFavoritesCount = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    try {
      const res = await fetch(`${apiBase}/api/KedvencTermek`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
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
      const serverItems = await fetchCartFromServer();
      setCartItems(mergeCartItems(serverItems));
      return;
    }
    setCartItems(loadGuestCart());
  }, [fetchCartFromServer, loadGuestCart, mergeCartItems]);

  const addToCart = useCallback(async (product, qty = 1) => {
    const token = localStorage.getItem('authToken');
    const quantity = Math.max(1, Number(qty) || 1);
    const isCustom = Boolean(product.isCustom || product.customId || product.egyediGitarId);

    const customId = product.customId ?? product.egyediGitarId ?? null;

    if (token && isCustom) {
      const res = await fetch(`${apiBase}/api/Cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ egyediGitarId: customId, quantity })
      });
      if (res.status === 401) { handleUnauthorized(); return; }

      const itemKey = `custom-${customId}`;
      const local = loadGuestCart();
      const idx = local.findIndex(i => i.itemKey === itemKey);
      if (idx >= 0) {
        local[idx] = { ...local[idx], quantity: local[idx].quantity + quantity };
      } else {
        local.push({
          itemKey,
          isCustom: true,
          customId,
          productId: null,
          title: product.title || product.nev || '',
          price: Number(product.price ?? product.ar) || 0,
          image: (product.images?.[0] ?? product.image ?? ''),
          isAvailable: product.isAvailable ?? product.elerheto ?? true,
          quantity,
        });
      }
      saveGuestCart(local);

      const serverItems = await fetchCartFromServer();
      setCartItems(mergeCartItems(serverItems));
      return;
    }

    if (token && !isCustom) {
      const productId = Number(product.id ?? product.productId);
      const res = await fetch(`${apiBase}/api/Cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ termekId: productId, quantity })
      });
      if (res.status === 401) { handleUnauthorized(); return; }
      const serverItems = await fetchCartFromServer();
      setCartItems(mergeCartItems(serverItems));
      return;
    }

    const productId = isCustom ? null : Number(product.id ?? product.productId);
    const itemKey = isCustom ? `custom-${customId}` : String(productId);

    setCartItems(prev => {
      const next = [...prev];
      const idx = next.findIndex(i => i.itemKey === itemKey);
      if (idx >= 0) {
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
      } else {
        next.push({
          itemKey,
          isCustom,
          customId,
          productId,
          title: product.title || product.nev || '',
          price: Number(product.price ?? product.ar) || 0,
          image: (product.images?.[0] ?? product.image ?? ''),
          isAvailable: product.isAvailable ?? product.elerheto ?? true,
          quantity,
        });
      }

      const toStore = token ? next.filter(i => i.isCustom) : next;
      saveGuestCart(toStore);
      return next;
    });
  }, [apiBase, fetchCartFromServer, saveGuestCart, handleUnauthorized, loadGuestCart, mergeCartItems]);

  const updateCartQuantity = useCallback(async (itemKey, quantity, isCustom = false) => {
    const qty = Math.max(0, Number(quantity) || 0);
    const token = localStorage.getItem('authToken');

    if (token && isCustom) {
      const customId = Number(String(itemKey).replace('custom-', ''));
      const res = await fetch(`${apiBase}/api/Cart/set`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ egyediGitarId: customId, quantity: qty })
      });
      if (res.status === 401) { handleUnauthorized(); return; }

      const local = loadGuestCart();
      const nextLocal = local
        .map(i => i.itemKey === itemKey ? { ...i, quantity: qty } : i)
        .filter(i => i.quantity > 0);
      saveGuestCart(nextLocal);

      const serverItems = await fetchCartFromServer();
      setCartItems(mergeCartItems(serverItems));
      return;
    }

    if (token && !isCustom) {
      const pid = Number(itemKey);
      const res = await fetch(`${apiBase}/api/Cart/set`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ termekId: pid, quantity: qty })
      });
      if (res.status === 401) { handleUnauthorized(); return; }
      const serverItems = await fetchCartFromServer();
      setCartItems(mergeCartItems(serverItems));
      return;
    }

    setCartItems(prev => {
      const next = prev
        .map(i => i.itemKey === itemKey ? { ...i, quantity: qty } : i)
        .filter(i => i.quantity > 0);
      const toStore = token ? next.filter(i => i.isCustom) : next;
      saveGuestCart(toStore);
      return next;
    });
  }, [apiBase, fetchCartFromServer, saveGuestCart, handleUnauthorized, loadGuestCart, mergeCartItems]);

  const removeFromCart = useCallback(async (itemKey, isCustom = false) => {
    const token = localStorage.getItem('authToken');

    if (token && isCustom) {
      const customId = Number(String(itemKey).replace('custom-', ''));
      const res = await fetch(`${apiBase}/api/Cart/set`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ egyediGitarId: customId, quantity: 0 })
      });
      if (res.status === 401) { handleUnauthorized(); return; }

      const local = loadGuestCart();
      const nextLocal = local.filter(i => i.itemKey !== itemKey);
      saveGuestCart(nextLocal);

      const serverItems = await fetchCartFromServer();
      setCartItems(mergeCartItems(serverItems));
      return;
    }

    if (token && !isCustom) {
      const pid = Number(itemKey);
      const res = await fetch(`${apiBase}/api/Cart/remove/product/${pid}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) { handleUnauthorized(); return; }
      const serverItems = await fetchCartFromServer();
      setCartItems(mergeCartItems(serverItems));
      return;
    }

    setCartItems(prev => {
      const next = prev.filter(i => i.itemKey !== itemKey);
      const toStore = token ? next.filter(i => i.isCustom) : next;
      saveGuestCart(toStore);
      return next;
    });
  }, [apiBase, fetchCartFromServer, saveGuestCart, handleUnauthorized, loadGuestCart, mergeCartItems]);

  const clearCart = useCallback(async () => {
    const token = localStorage.getItem('authToken');

    if (token) {
      const res = await fetch(`${apiBase}/api/Cart/clear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) { handleUnauthorized(); return; }
      localStorage.removeItem(GUEST_CART_KEY);
      const serverItems = await fetchCartFromServer();
      setCartItems(mergeCartItems(serverItems));
      return;
    }

    localStorage.removeItem(GUEST_CART_KEY);
    setCartItems([]);
  }, [apiBase, fetchCartFromServer, handleUnauthorized, mergeCartItems]);

  const placeOrder = useCallback(async (deliveryData) => {
    const token = localStorage.getItem('authToken');
    if (!token) return { success: false, error: 'Kérjük, jelentkezz be!' };

    try {
      const res = await fetch(`${apiBase}/api/Cart/checkout`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(deliveryData ?? {})
      });

      if (res.status === 401) {
        handleUnauthorized();
        return { success: false, error: 'Kérjük, jelentkezz be!' };
      }

      if (!res.ok) {
        const errorText = await res.text();
        return { success: false, error: errorText || 'Nem sikerült a rendelés' };
      }

      localStorage.removeItem(GUEST_CART_KEY);
      await refreshCart();

      const data = await res.json();
      return { success: true, orderId: data.orderId, total: data.total };
    } catch (error) {
      console.error('Order error:', error);
      return { success: false, error: 'Nem sikerült csatlakozni a szerverhez' };
    }
  }, [apiBase, authHeaders, handleUnauthorized, refreshCart]);

  const cartCount = cartItems.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    const init = async () => {
      let userData = null;
      if (token && storedUser) {
        try {
          userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          handleUnauthorized();
        }
      }

      if (userData) {
        await fetchFavoritesCount();
        await refreshCart();
      } else {
        setCartItems(loadGuestCart());
      }

      setLoading(false);
    };

    init();
  }, []);

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

      const token = data.token ?? data.Token;
      const name = data.name ?? data.Name;
      const userEmail = data.email ?? data.Email;
      const permission = data.permission ?? data.Permission;

      if (!token) {
        return { success: false, error: 'Érvénytelen szerver válasz' };
      }

      localStorage.setItem('authToken', token);
      const userData = { name, email: userEmail, permission };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);

      fetchFavoritesCount().catch(() => {});
      refreshCart().catch(() => {});

      return { success: true, name };
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
    placeOrder,
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
