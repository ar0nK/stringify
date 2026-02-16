import { useEffect, useState } from 'react';
import Card from '../components/Card.jsx'
import NavBar from '../components/NavBar.jsx'
import Filters from '../components/Filters.jsx'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SavedProducts() {
  const { apiBase, authHeaders, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [savedProducts, setSavedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/saved-products' } } });
      return;
    }

    if (!isAuthenticated) {
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");
        
        const res = await fetch(`${apiBase}/api/kedvencetermek/products`, {
          method: "GET",
          headers: authHeaders(),
        });

        if (!res.ok) {
          if (res.status === 401) {
            navigate('/login', { state: { from: { pathname: '/saved-products' } } });
            return;
          }
          throw new Error('Nem sikerült betölteni a kedvenc termékeket');
        }

        const data = await res.json();
        
        if (!cancelled) {
          setSavedProducts(data);
          setFilteredProducts(data);
          setFavorites(new Set(data.map(p => p.id)));
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError("Nem sikerült betölteni a kedvenc termékeket.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => (cancelled = true);
  }, [apiBase, authHeaders, isAuthenticated, authLoading, navigate]);

  const handleFiltersChange = (filtered) => {
    setFilteredProducts(filtered);
  };

  const toggleFavorite = async (productId) => {
    try {
      const res = await fetch(`${apiBase}/api/kedvencetermek/toggle/${productId}`, {
        method: "POST",
        headers: authHeaders(),
      });

      if (res.ok) {
        const data = await res.json();
        
        if (!data.isFavorite) {
          setSavedProducts(prev => prev.filter(p => p.id !== productId));
          setFilteredProducts(prev => prev.filter(p => p.id !== productId));
          setFavorites(prev => {
            const newFavorites = new Set(prev);
            newFavorites.delete(productId);
            return newFavorites;
          });
        }
      } else if (res.status === 401) {
        navigate('/login', { state: { from: { pathname: '/saved-products' } } });
      } else {
        const errorData = await res.text();
        console.error("Toggle favorite failed:", errorData);
        alert("Hiba történt a művelet során.");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Hiba történt a kedvencek módosítása során.");
    }
  };

  if (authLoading || loading) {
    return (
      <div>
        <NavBar />
        <div className="container mt-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Betöltés...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar/>
      <div className="container-fluid mt-4 px-lg-5">
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
            <h2 className="mb-4">Kedvenc Termékek</h2>
            
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
                      onAddToCart={() => console.log(`${product.title} added to cart`)}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}