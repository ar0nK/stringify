import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import guitarbuilderimg from '../img/guitarbuildericon.png'
import webshopimg from '../img/webshopicon.png'
import logo from '../img/logo.png'

export default function PageSelector() {
  const { isAuthenticated } = useAuth();
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

  return (
    <div className="px-2 bg-body text-body" style={{ minHeight: '100vh', position: 'relative' }}>
      <button
        className="btn p-0 border-0 bg-transparent nav-link position-absolute"
        style={{ top: '1.25rem', right: '1.5rem' }}
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <i className={`bi ${theme === "light" ? "bi-moon" : "bi-sun"}`} style={{ fontSize: '1.5rem' }}></i>
      </button>

      <div className="text-center pt-5 pb-2">
        <img src={logo} alt="Stringify" style={{ height: '10rem', width: 'auto' }} />
      </div>
      <h2 className='p-3 text-center' style={{ fontSize: 'clamp(1.25rem, 5vw, 2.5rem)' }}>Kérjük válaszd ki, melyik oldalt akarod használni.</h2>
      <div className="container text-center">
        <div className='row row-cols-1 row-cols-md-2 g-4'>
          <div className='col'>
            <div className='bg-body-secondary p-4 rounded-4 h-100 page-selector-card'>
              <img className="icon-image rounded-3" src={webshopimg} alt="" />
              <h4>Webshop</h4>
              <h6>Fedezd fel a Webshop gitárkínálatát, ahol a kezdő szettektől a profi hangszerekig, széles választékban gitárokat találsz.</h6>
              <Link to="/store"><button style={{fontFamily: 'Inter'}} className='btn btn-dark rounded-pill mt-2 px-4'>Tovább</button></Link>
            </div>
          </div>
          <div className='col'>
            <div className='bg-body-secondary p-4 rounded-4 h-100 page-selector-card'>
              <img className="icon-image rounded-3" src={guitarbuilderimg} alt="" />
              <h4>Gitárépítő</h4>
              <h6>Tervezd meg álomgitárodat a Gitárépítő oldalon: válassz formát, hardvert és elektronikát, és alkoss egyedi hangszert.</h6>
              <button onClick={handleGuitarBuilderClick} style={{fontFamily: 'Inter'}} className='btn btn-dark rounded-pill mt-2 px-4'>Tovább</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}