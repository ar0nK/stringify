import { useEffect, useState } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import Card from '../components/Card.jsx'
import NavBar from '../components/NavBar.jsx'
import Footer from '../components/Footer.jsx'
import Filters from '../components/Filters.jsx'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SavedProducts() {
  const {
    apiBase,
    authHeaders,
    isAuthenticated,
    loading: authLoading,
    setFavoritesCount,
    handleUnauthorized,
    addToCart,
  } = useAuth();

  const navigate = useNavigate();
  const [savedProducts, setSavedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.warn('[SavedProducts] User is not authenticated — redirecting to login.');
      navigate('/login', { state: { from: { pathname: '/saved-products' } } });
      return;
    }

    if (!isAuthenticated) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");

        console.log('[SavedProducts] Fetching saved products...');

        const res = await fetch(`${apiBase}/api/KedvencTermek/products`, {
          method: "GET",
          headers: authHeaders(),
        });

        if (!res.ok) {
          if (res.status === 401) {
            console.warn('[SavedProducts] Received 401 — clearing auth state and redirecting to login.');
            if (!cancelled) {
              handleUnauthorized();
              navigate('/login', { state: { from: { pathname: '/saved-products' } } });
            }
            return;
          }

          console.error(`[SavedProducts] Failed to fetch saved products: HTTP ${res.status}`);
          throw new Error('Nem sikerült betölteni a kedvenc termékeket');
        }

        const data = await res.json();
        console.log(`[SavedProducts] Loaded ${data.length} saved product(s).`);

        if (!cancelled) {
          setSavedProducts(data);
          setFilteredProducts(data);
          setFavorites(new Set(data.map(p => p.id)));
          setFavoritesCount(data.length);
        }
      } catch (e) {
        console.error('[SavedProducts] Exception while fetching saved products:', e);
        if (!cancelled) setError("Nem sikerült betölteni a kedvenc termékeket.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => (cancelled = true);
  }, [apiBase, authHeaders, isAuthenticated, authLoading, navigate, setFavoritesCount, handleUnauthorized]);

  const handleFiltersChange = (filtered) => {
    setFilteredProducts(filtered);
  };

  const toggleFavorite = async (productId) => {
    try {
      const res = await fetch(`${apiBase}/api/KedvencTermek/toggle/${productId}`, {
        method: "POST",
        headers: authHeaders(),
      });

      if (res.ok) {
        const data = await res.json();

        if (!data.isFavorite) {
          setSavedProducts(prev => {
            const updated = prev.filter(p => p.id !== productId);
            setFavoritesCount(updated.length);
            return updated;
          });
          setFilteredProducts(prev => prev.filter(p => p.id !== productId));
          setFavorites(prev => {
            const newFavorites = new Set(prev);
            newFavorites.delete(productId);
            return newFavorites;
          });
          showToast(`Termék eltávolítva a kedvencekből.`, 'info');
        }
      } else if (res.status === 401) {
        console.warn('[SavedProducts] toggleFavorite returned 401 — clearing auth and redirecting.');
        handleUnauthorized();
        navigate('/login', { state: { from: { pathname: '/saved-products' } } });
      } else {
        const errorData = await res.text();
        console.error('[SavedProducts] toggleFavorite failed:', res.status, errorData);
      }
    } catch (error) {
      console.error('[SavedProducts] Exception while toggling favorite:', error);
    }
  };

  const handleAddToCart = async (product) => {
    await addToCart(product, 1);
    showToast(`${product.title} hozzáadva a kosárhoz!`, 'success');
  };

  if (authLoading || loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <NavBar />
        <div className="container mt-5 text-center flex-grow-1">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Betöltés...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />

      {toast && (
        <div className={`position-fixed bottom-0 end-0 m-4 alert ${toast.type === 'success' ? 'alert-success' : 'alert-secondary'} d-flex align-items-center gap-2 shadow`}
          style={{ zIndex: 9999, minWidth: '260px' }}>
          {toast.type === 'success' ? <ShoppingCart size={16} /> : <Heart size={16} fill="currentColor" />}
          {toast.message}
        </div>
      )}

      <div className="container-fluid mt-4 px-lg-5 pb-5 flex-grow-1">
        <div className="row">
          <aside className="col-12 col-lg-2 mb-4 pe-lg-5">
            <div className="d-none d-lg-block position-sticky" style={{ top: '20vh' }}>
              <div className="w-100" style={{ height: '420px' }}>
                <Filters onFiltersChange={handleFiltersChange} products={savedProducts} />
              </div>
            </div>
            <div className="d-lg-none">
              <Filters onFiltersChange={handleFiltersChange} products={savedProducts} />
            </div>
          </aside>
          <section className="col-12 col-lg-10 ps-lg-5">
            <h2 className="mb-4 mt-4">Kedvenc Termékek</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            {!error && filteredProducts.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-heart" style={{ fontSize: '4rem', color: '#dee2e6' }}></i>
                <h4 className="mt-3 text-muted">Még nincsenek kedvenc termékeid</h4>
                <p className="text-muted">Kezdj el termékeket böngészni és add hozzá a kedvenceidhez!</p>
                <a href="/store" className="btn btn-primary mt-3">Ugrás a boltba</a>
              </div>
            )}

            {filteredProducts.length > 0 && (
              <div className="row g-5">
                {filteredProducts.map(product => (
                  <div key={product.id} className="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex">
                    <Card
                      id={product.id}
                      images={product.images || []}
                      title={product.title}
                      rating={product.rating}
                      reviewCount={product.reviewCount}
                      shortDescription={product.shortDescription}
                      longDescription={product.longDescription}
                      previewDescription={product.previewDescription}
                      isAvailable={product.isAvailable}
                      price={product.price}
                      isFavorite={favorites.has(product.id)}
                      onToggleFavorite={toggleFavorite}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}