import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card.jsx";
import NavBar from "../components/NavBar.jsx";
import Filters from "../components/Filters.jsx";
import { useAuth } from "../context/AuthContext";
import { Heart } from "lucide-react";

export default function Store() {
  const { apiBase, authHeaders, isAuthenticated, setFavoritesCount } = useAuth();
  const navigate = useNavigate();
  const [guitars, setGuitars] = useState([]);
  const [filteredGuitars, setFilteredGuitars] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${apiBase}/api/products`, {
          method: "GET",
          headers: authHeaders(),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled) {
          setGuitars(data);
          setFilteredGuitars(data);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Nem sikerült betölteni a termékeket.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => (cancelled = true);
  }, [apiBase, authHeaders]);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavorites(new Set());
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${apiBase}/api/KedvencTermek`, {
          method: "GET",
          headers: authHeaders(),
        });

        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setFavorites(new Set(data));
        } else if (res.status === 401) {
          if (!cancelled) setFavorites(new Set());
        }
      } catch (e) {
        console.error("Failed to fetch favorites:", e);
      }
    })();
    return () => (cancelled = true);
  }, [apiBase, authHeaders, isAuthenticated]);

  const handleFiltersChange = (filtered) => {
    setFilteredGuitars(filtered);
  };

  const toggleFavorite = async (productId) => {
    if (!isAuthenticated) {
      navigate('/login?register=true');
      return;
    }

    const productTitle = guitars.find(g => g.id === productId)?.title || '';

    try {
      const res = await fetch(`${apiBase}/api/KedvencTermek/toggle/${productId}`, {
        method: "POST",
        headers: authHeaders(),
      });

      if (res.ok) {
        const data = await res.json();
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          if (data.isFavorite) {
            newFavorites.add(productId);
          } else {
            newFavorites.delete(productId);
          }
          setFavoritesCount(newFavorites.size);
          return newFavorites;
        });
        showToast(
          data.isFavorite
            ? `${productTitle} hozzáadva a kedvencekhez!`
            : `${productTitle} eltávolítva a kedvencekből.`,
          data.isFavorite ? 'success' : 'info'
        );
      } else if (res.status === 401) {
        navigate('/login?register=true');
      } else {
        const errorData = await res.text();
        console.error("Toggle favorite failed:", errorData);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div>
      <NavBar />

      {toast && (
        <div
          className={`position-fixed bottom-0 end-0 m-4 alert ${toast.type === 'success' ? 'alert-success' : 'alert-secondary'} d-flex align-items-center gap-2 shadow`}
          style={{ zIndex: 9999, minWidth: '260px', transition: 'opacity 0.3s' }}
        >
          <Heart size={16} fill="currentColor" />
          {toast.message}
        </div>
      )}

      <div className="container-fluid mt-4 px-lg-5">
        <div className="row">
          <aside className="col-12 col-lg-2 mb-4 pe-lg-5">
            <div className="d-none d-lg-block position-sticky" style={{ top: "calc(100px + 1rem)", width: "100%" }}>
              <Filters onFiltersChange={handleFiltersChange} products={guitars} />
            </div>
            <div className="d-lg-none">
              <Filters onFiltersChange={handleFiltersChange} products={guitars} />
            </div>
          </aside>
          <section className="col-12 col-lg-10 ps-lg-5">
            {loading && <div className="py-4">Betöltés...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && !error && (
              <div className="row g-5">
                {filteredGuitars.map((guitar) => (
                  <div key={guitar.id} className="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex">
                    <Card
                      id={guitar.id}
                      images={guitar.images?.length ? guitar.images : []}
                      title={guitar.title}
                      rating={guitar.rating}
                      reviewCount={guitar.reviewCount}
                      shortDescription={guitar.shortDescription}
                      longDescription={guitar.longDescription}
                      previewDescription={guitar.previewDescription}
                      isAvailable={guitar.isAvailable}
                      price={guitar.price}
                      isFavorite={favorites.has(guitar.id)}
                      onToggleFavorite={toggleFavorite}
                      onAddToCart={() => console.log(`${guitar.title} added to cart`)}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}