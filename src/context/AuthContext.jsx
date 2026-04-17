import { createContext, useState, useEffect, useContext, useCallback } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const GUEST_CART_KEY = 'cart_guest';
  const LAST_BILLING_KEY = 'lastBillingAddress';

  const authHeaders = useCallback(() => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }, []);

  const handleUnauthorized = useCallback(() => {
    console.warn('[Auth] Clearing auth state due to unauthorized response.');
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
    } catch (e) {
      console.error('[Cart] Failed to parse guest cart from localStorage:', e);
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

  const fetchCartFromServer = useCallback(async ({ silent = false } = {}) => {
    const token = localStorage.getItem('authToken');
    if (!token) return [];
    try {
      const res = await fetch(`${apiBase}/api/Cart`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        console.warn('[Cart] Fetching cart returned 401 — skipping cart sync, keeping local auth state.');
        return [];
      }
      if (!res.ok) {
        console.error(`[Cart] Failed to fetch cart: HTTP ${res.status}`);
        return [];
      }
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
      console.error('[Cart] Exception while fetching cart from server:', error);
      return [];
    }
  }, [apiBase]);

  const fetchFavoritesCount = useCallback(async ({ silent = false } = {}) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    try {
      const res = await fetch(`${apiBase}/api/KedvencTermek`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        console.warn('[Favorites] Fetching favorites returned 401 — clearing count, keeping local auth state.');
        setFavoritesCount(0);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setFavoritesCount(data.length);
      } else {
        console.error(`[Favorites] Failed to fetch favorites count: HTTP ${res.status}`);
      }
    } catch (e) {
      console.error('[Favorites] Exception while fetching favorites count:', e);
    }
  }, [apiBase]);

  const refreshCart = useCallback(async ({ silent = false } = {}) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const serverItems = await fetchCartFromServer({ silent });
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
      if (res.status === 401) { console.warn('[Cart] addToCart (custom) returned 401.'); handleUnauthorized(); return; }

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
      if (res.status === 401) { console.warn('[Cart] addToCart (product) returned 401.'); handleUnauthorized(); return; }
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
      if (res.status === 401) { console.warn('[Cart] updateCartQuantity (custom) returned 401.'); handleUnauthorized(); return; }

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
      if (res.status === 401) { console.warn('[Cart] updateCartQuantity (product) returned 401.'); handleUnauthorized(); return; }
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
      if (res.status === 401) { console.warn('[Cart] removeFromCart (custom) returned 401.'); handleUnauthorized(); return; }

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
      if (res.status === 401) { console.warn('[Cart] removeFromCart (product) returned 401.'); handleUnauthorized(); return; }
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
      if (res.status === 401) { console.warn('[Cart] clearCart returned 401.'); handleUnauthorized(); return; }
      localStorage.removeItem(GUEST_CART_KEY);
      const serverItems = await fetchCartFromServer();
      setCartItems(mergeCartItems(serverItems));
      return;
    }

    localStorage.removeItem(GUEST_CART_KEY);
    setCartItems([]);
  }, [apiBase, fetchCartFromServer, handleUnauthorized, mergeCartItems]);

  const updateUserProfile = useCallback((profileData) => {
    setUser(prev => {
      const previousUser = prev || {};
      const firstName = profileData?.firstName?.trim() || '';
      const lastName = profileData?.lastName?.trim() || '';
      const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();

      const nextUser = {
        ...previousUser,
        ...profileData,
        name: fullName || previousUser.name || '',
        email: profileData?.email ?? previousUser.email ?? '',
      };

      localStorage.setItem('user', JSON.stringify(nextUser));
      return nextUser;
    });
  }, []);

  const saveBillingAddress = useCallback((billingData) => {
    localStorage.setItem(LAST_BILLING_KEY, JSON.stringify(billingData ?? {}));
  }, []);

  const fetchOrders = useCallback(async ({ silent = false } = {}) => {
    const token = localStorage.getItem('authToken');
    if (!token) return [];
    try {
      const res = await fetch(`${apiBase}/api/Rendeles`, {
        headers: authHeaders()
      });
      if (res.status === 401) {
        console.warn('[Orders] Fetching orders returned 401 — skipping.');
        return [];
      }
      if (!res.ok) {
        console.error(`[Orders] Failed to fetch orders: HTTP ${res.status}`);
        return [];
      }
      const data = await res.json();
      return data || [];
    } catch (error) {
      console.error('[Orders] Exception while fetching orders:', error);
      return [];
    }
  }, [apiBase, authHeaders]);

  const refreshOrders = useCallback(async ({ silent = false } = {}) => {
    const serverOrders = await fetchOrders({ silent });
    setOrders(serverOrders);
  }, [fetchOrders]);

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
        console.warn('[Order] placeOrder returned 401 — logging out.');
        handleUnauthorized();
        return { success: false, error: 'Kérjük, jelentkezz be!' };
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[Order] placeOrder failed: HTTP ${res.status}`, errorText);
        return { success: false, error: errorText || 'Nem sikerült a rendelés' };
      }

      localStorage.removeItem(GUEST_CART_KEY);
      localStorage.setItem(LAST_BILLING_KEY, JSON.stringify(deliveryData ?? {}));
      await refreshCart();
      await refreshOrders();

      const data = await res.json();
      return { success: true, orderId: data.orderId, total: data.total };
    } catch (error) {
      console.error('[Order] Exception during placeOrder:', error);
      return { success: false, error: 'Nem sikerült csatlakozni a szerverhez' };
    }
  }, [apiBase, authHeaders, handleUnauthorized, refreshCart, refreshOrders]);

  const cartCount = cartItems.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      console.log('[Auth] Initializing auth state...');

      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      let userData = null;
      if (token && storedUser) {
        try {
          userData = JSON.parse(storedUser);
          if (!cancelled) {
            setUser(userData);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('[Auth] Failed to parse stored user from localStorage — clearing auth state:', error);
          handleUnauthorized();
        }
      }

      if (cancelled) return;

      if (userData) {
        await fetchFavoritesCount({ silent: true });
        await refreshCart({ silent: true });
      } else {
        console.log('[Auth] No stored session found — loading guest cart.');
        setCartItems(loadGuestCart());
      }

      if (!cancelled) {
        console.log('[Auth] Initialization complete.');
        setLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [fetchFavoritesCount, handleUnauthorized, loadGuestCart, refreshCart]);

  const login = async (email, password) => {
    try {
      const saltResponse = await fetch(`${apiBase}/login/GetSalt/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!saltResponse.ok) {
        const errorText = await saltResponse.text();
        console.error('[Auth] Failed to fetch salt:', errorText);
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
        console.error('[Auth] Login failed:', errorText);
        return { success: false, error: errorText || 'Hibás email vagy jelszó' };
      }

      const data = await loginResponse.json();

      const token = data.token ?? data.Token;
      const name = data.name ?? data.Name;
      const userEmail = data.email ?? data.Email;
      const permission = data.permission ?? data.Permission;

      if (!token) {
        console.error('[Auth] Login response did not include a token:', data);
        return { success: false, error: 'Érvénytelen szerver válasz' };
      }

      localStorage.setItem('authToken', token);
      const userData = { name, email: userEmail, permission };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);

      try {
        await fetchFavoritesCount({ silent: true });
      } catch (e) {
        console.warn('[Auth] Could not load favorites after login:', e);
      }

      try {
        await refreshCart({ silent: true });
      } catch (e) {
        console.warn('[Auth] Could not load cart after login:', e);
      }

      try {
        await refreshOrders({ silent: true });
      } catch (e) {
        console.warn('[Auth] Could not load orders after login:', e);
      }

      return { success: true, name };
    } catch (error) {
      console.error('[Auth] Exception during login:', error);
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
        console.error('[Auth] Registration failed:', errorText);
        return { success: false, error: errorText || 'Regisztráció sikertelen' };
      }

      const message = await response.text();
      return { success: true, message };
    } catch (error) {
      console.error('[Auth] Exception during registration:', error);
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
        console.error('[Auth] Exception during logout request (continuing anyway):', error);
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
    handleUnauthorized,
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
    updateUserProfile,
    saveBillingAddress,
    placeOrder,
    orders,
    refreshOrders,
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
