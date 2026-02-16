import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import NavBar from "../components/NavBar.jsx";
import Filters from "../components/Filters.jsx";
import { useAuth } from "../context/AuthContext";

export default function Store() {
  const { apiBase, authHeaders, isAuthenticated } = useAuth();
  const [guitars, setGuitars] = useState([]);
  const [filteredGuitars, setFilteredGuitars] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        const res = await fetch(`${apiBase}/api/kedvencetermek`, {
          method: "GET",
          headers: authHeaders(),
        });
        
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setFavorites(new Set(data));
          }
        } else if (res.status === 401) {
          if (!cancelled) {
            setFavorites(new Set());
          }
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
      alert("Kérjük, jelentkezz be a kedvencek használatához!");
      return;
    }

    try {
      const res = await fetch(`${apiBase}/api/kedvencetermek/toggle/${productId}`, {
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
          return newFavorites;
        });
      } else if (res.status === 401) {
        alert("Kérjük, jelentkezz be újra!");
      } else {
        const errorData = await res.text();
        console.error("Toggle favorite failed:", errorData);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Hiba történt a kedvencek módosítása során.");
    }
  };

  return (
    <div>
      <NavBar />
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