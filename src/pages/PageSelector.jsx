import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import guitarbuilderimg from '../img/guitarbuildericon.png'
import webshopimg from '../img/webshopicon.png'
import logo from '../img/logo.png'

export default function PageSelector() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "theme") setTheme(e.newValue || "light");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleGuitarBuilderClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/guitar-builder');
    } else {
      navigate('/login', { state: { from: { pathname: '/guitar-builder' } } });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="px-2 bg-body text-body" style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="position-absolute d-flex align-items-center gap-4" style={{ top: '1.25rem', right: '1.5rem' }}>
        
        <button className="btn p-0 border-0 bg-transparent nav-link" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          <i className={`bi ${theme === "light" ? "bi-moon" : "bi-sun"}`} style={{ fontSize: '1.5rem' }}></i>
        </button>

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
      <div className="text-center pt-5 pb-2">
        <img src={logo} alt="Stringify" style={{ height: '10rem', width: 'auto' }} />
      </div>
      <h2 className='p-3 text-center' style={{ fontSize: 'clamp(1.25rem, 5vw, 2.5rem)' }}>Kérjük válaszd ki, melyik oldalt akarod használni.</h2>
      <div className="container text-center">
        <div className='row row-cols-1 row-cols-md-2 g-4'>
          <div className='col'>
            <div className='bg-body-secondary p-4 rounded-4 h-100 page-selector-card'>
              <Link to="/store"><img className="icon-image rounded-3" src={webshopimg} alt="" /></Link>
              <h4>Webshop</h4>
              <h6>Fedezd fel a webshop hangszerkínálatát, ahol széles választékban találhatsz gitárokat.</h6>
              <Link to="/store"><button style={{fontFamily: 'Inter'}} className='btn btn-dark rounded-pill mt-2 px-4'>Tovább</button></Link>
            </div>
          </div>
          <div className='col'>
            <div className='bg-body-secondary p-4 rounded-4 h-100 page-selector-card'>
              <Link to="/guitar-builder"><img className="icon-image rounded-3" src={guitarbuilderimg} alt="" /></Link>
              <h4>Gitár építő</h4>
              <h6>Tervezd meg álomgitárodat a gitár építő oldalon: válassz formát, test és pickguard színt, és alkoss egyedi hangszert.</h6>
              <button onClick={handleGuitarBuilderClick} style={{fontFamily: 'Inter'}} className='btn btn-dark rounded-pill mt-2 px-4'>Tovább</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}