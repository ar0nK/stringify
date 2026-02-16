import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from "react-router";
import { useAuth } from '../context/AuthContext';

export default function SearchBar({ theme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { apiBase, authHeaders } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/api/products`, {
        method: "GET",
        headers: authHeaders(),
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await res.json();
      
      const filtered = data.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filtered.slice(0, 5));
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (productId) => {
    navigate(`/product_info/${productId}`);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleResultClick(searchResults[0].id);
    }
  };

  return (
    <div className="d-flex justify-content-center flex-grow-1 my-2 my-lg-0 position-relative" ref={searchRef}>
      <form className="d-flex position-relative" role="search" style={{ maxWidth: '600px', width: '100%' }} onSubmit={handleSubmit}>
        <i className="bi bi-search position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, color: '#6c757d' }}></i>
        <input 
          className={`form-control ps-5 rounded ${ theme === "dark" && location.pathname !== "/" ? "bg-dark text-light border-secondary" : "bg-light" }`} 
          type="search" 
          placeholder="Search" 
          aria-label="Search"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchResults.length > 0 && setShowResults(true)}
        />
      </form>
      
      {showResults && (
        <div 
          className="position-absolute top-100 mt-1 w-100 border rounded shadow" 
          style={{ 
            maxWidth: '600px', 
            zIndex: 1050,
            backgroundColor: theme === "dark" ? '#212529' : '#ffffff'
          }}
        >
          {loading && (
            <div className="p-3 text-center">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          
          {!loading && searchResults.length === 0 && (
            <div className="p-3 text-center text-muted">
              Nincs találat
            </div>
          )}
          
          {!loading && searchResults.length > 0 && searchResults.map(product => (
            <div 
              key={product.id}
              className={`p-3 border-bottom cursor-pointer ${theme === "dark" ? 'border-secondary' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => handleResultClick(product.id)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === "dark" ? '#343a40' : '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div className="d-flex align-items-center gap-3">
                {product.images && product.images.length > 0 && (
                  <img 
                    src={product.images[0]} 
                    alt={product.title}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                )}
                <div className="flex-grow-1">
                  <div className="fw-semibold">{product.title}</div>
                  <div className="text-muted small">{product.price.toLocaleString('hu-HU')} Ft</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}