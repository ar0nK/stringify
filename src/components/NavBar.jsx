import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchBar from './SearchBar';
import { useAuth } from '../context/AuthContext';
import logotext from '../img/logotext.png';
import logoimage from '../img/logoguitar.png';

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

            <div style={{ paddingLeft: '1rem', verticalAlign: 'center' }}>
              <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                <img src={logoimage} alt="" style={{ height: '5rem' }} />
                <img src={logotext} alt="Stringify" style={{ height: '2.8rem' }} />
              </Link>
            </div>

            <Link className="logo-nav-item d-none d-lg-flex" to="/store">
              <img src={logoimage} alt="" />
              Webshop
            </Link>

            <Link className="logo-nav-item d-none d-lg-flex" to="/guitar-builder">
              <img src={logoimage} alt="" />
              Gitár építő
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavDropdown"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNavDropdown">

              <div className="d-lg-none d-flex flex-column gap-2 px-3 pb-2">
                <Link className="logo-nav-item d-flex align-items-center gap-2" to="/store">
                  <img src={logoimage} alt="" />
                  Webshop
                </Link>

                <Link className="logo-nav-item d-flex align-items-center gap-2" to="/guitar-builder">
                  <img src={logoimage} alt="" />
                  Gitár építő
                </Link>
              </div>  

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

                  <button
                    className="nav-link btn p-0 border-0 bg-transparent"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  >
                    <i className={`bi ${theme === "light" ? "bi-moon" : "bi-sun"}`} style={{ fontSize: '1.5rem' }}></i>
                  </button>
                </div>

                {isAuthenticated ? (
                  <div className="dropdown">
                    <button
                      className="nav-link btn p-0 border-0 bg-transparent"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ boxShadow: 'none' }}
                    >
                      <i className="bi bi-person-circle" style={{ fontSize: '3rem' }}></i>
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end py-1" style={{ minWidth: '160px' }}>
                      <li>
                        <span className="dropdown-item-text py-1 small fw-semibold">
                          {user?.name}
                        </span>
                      </li>
                      <li><hr className="dropdown-divider my-1" /></li>
                      <li>
                        <Link className="dropdown-item py-1 small" to="/profile">
                          <i className="bi bi-person me-2"></i>Profil
                        </Link>
                      </li>
                      <li>
                        <button
                          className="dropdown-item py-1 small text-danger"
                          onClick={handleLogout}
                        >
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
