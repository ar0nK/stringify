import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import NavBar from "../components/NavBar.jsx";
import Filters from "../components/Filters.jsx";
import { useAuth } from "../context/AuthContext";

export default function Store() {
  const { apiBase, authHeaders } = useAuth();
  const [guitars, setGuitars] = useState([]);
  const [filteredGuitars, setFilteredGuitars] = useState([]);
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

  const handleFiltersChange = (filtered) => {
    setFilteredGuitars(filtered);
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