import React, { useState, useEffect } from 'react'
import { Link, useLocation } from "react-router";
import SearchBar from './SearchBar';

export default function NavBar() {

  const location = useLocation();
  const isGuitarBuilder = location.pathname === "/guitar-builder";

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

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
            {!isGuitarBuilder && (
            <SearchBar theme={theme} />
            )}
            <div className={`d-flex flex-row gap-5 align-items-center justify-content-center justify-content-lg-end me-lg-5 ${isGuitarBuilder ? 'ms-auto' : ''}`}>
              <div className="d-flex flex-row gap-5 me-lg-4">
                <Link className="nav-link" to="/saved-products"><i className="bi bi-heart" style={{ fontSize: '1.5rem' }}></i></Link>
                <Link className="nav-link" to="/cart"><i className="bi bi-cart" style={{ fontSize: '1.5rem' }}></i></Link>
                <button className="nav-link btn p-0 border-0 bg-transparent" onClick={() => setTheme(theme === "light" ? "dark" : "light")} >
                  <i className={`bi ${theme === "light" ? "bi-moon" : "bi-sun"}`} style={{ fontSize: '1.5rem' }}></i>
                </button>
              </div>
              <Link className="nav-link" to="/profile">
                <i className="bi bi-person-circle" style={{ fontSize: '3rem' }}></i>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <hr className="mt-0"/>
    </div>
    <div style={{ height: '80px' }}/>
  </>
  )
}