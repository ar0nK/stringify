import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router";
import SearchBar from './SearchBar';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isGuitarBuilder = location.pathname === "/guitar-builder";
  const { isAuthenticated, user, logout, favoritesCount, cartCount } = useAuth();

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <div className="position-fixed top-0 start-0 end-0" style={{ zIndex: 1030 }}>
        <nav className="navbar navbar-expand-lg bg-body">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">Stringify</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              {!isGuitarBuilder && <SearchBar theme={theme} />}
              <div className={`d-flex flex-row gap-5 align-items-center justify-content-center justify-content-lg-end me-lg-5 ${isGuitarBuilder ? 'ms-auto' : ''}`}>
                <div className="d-flex flex-row gap-5 me-lg-4">
                  <Link className="nav-link position-relative" to="/saved-products">
                    <i className="bi bi-heart" style={{ fontSize: '1.5rem' }}></i>
                    {isAuthenticated && favoritesCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem', minWidth: '1.2rem' }}>
                        {favoritesCount >= 10 ? '9+' : favoritesCount}
                      </span>
                    )}
                  </Link>

                  <Link className="nav-link position-relative" to="/cart">
                    <i className="bi bi-cart" style={{ fontSize: '1.5rem' }}></i>
                    {cartCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem', minWidth: '1.2rem' }}>
                        {cartCount >= 10 ? '9+' : cartCount}
                      </span>
                    )}
                  </Link>

                  <button className="nav-link btn p-0 border-0 bg-transparent" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                    <i className={`bi ${theme === "light" ? "bi-moon" : "bi-sun"}`} style={{ fontSize: '1.5rem' }}></i>
                  </button>
                </div>

                {isAuthenticated ? (
                  <div className="dropdown">
                    <button className="nav-link btn p-0 border-0 bg-transparent" data-bs-toggle="dropdown" aria-expanded="false" style={{ boxShadow: 'none' }}>
                      <i className="bi bi-person-circle" style={{ fontSize: '3rem' }}></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end py-1" style={{ minWidth: '160px' }}>
                      <li>
                        <span className="dropdown-item-text py-1 small fw-semibold">{user?.name}</span>
                      </li>
                      <li><hr className="dropdown-divider my-1" /></li>
                      <li>
                        <button className="dropdown-item py-1 small text-danger" onClick={handleLogout}>
                          <i className="bi bi-box-arrow-right me-2"></i>Kijelentkezés
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="d-flex flex-row gap-2">
                    <Link className="btn btn-outline-secondary" to="/login">Bejelentkezés</Link>
                    <Link className="btn btn-primary" to="/login?register=true">Regisztrálás</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
        <hr className="mt-0" />
      </div>
      <div style={{ height: '80px' }} />
    </>
  );
}
