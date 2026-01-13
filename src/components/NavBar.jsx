import React from 'react'
import { Link } from "react-router";

export default function NavBar() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">Stringify</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <div className="d-flex justify-content-center flex-grow-1 my-2 my-lg-0">
              <form className="d-flex position-relative" role="search" style={{ maxWidth: '600px', width: '100%' }}>
                <i className="bi bi-search position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, color: '#6c757d' }}></i>
                <input className="bg-light form-control ps-5 rounded-pill" type="search" placeholder="Search" aria-label="Search"/>
              </form>
            </div>
            <div className="d-flex flex-row gap-5 align-items-center justify-content-center justify-content-lg-end me-lg-5">
              <div className="d-flex flex-row gap-5 me-lg-4">
                <Link className="nav-link" to="/saved-products"><i className="bi bi-heart" style={{ fontSize: '1.5rem' }}></i></Link>
                <Link className="nav-link" to="/cart"><i className="bi bi-cart" style={{ fontSize: '1.5rem' }}></i></Link>
                <Link className="nav-link" to="/settings"><i className="bi bi-gear" style={{ fontSize: '1.5rem' }}></i></Link>
              </div>
              <Link className="nav-link" to="/profile"><i className="bi bi-person-circle" style={{ fontSize: '3rem' }}></i></Link>
            </div>
          </div>
        </div>
      </nav>
      <hr className="mt-0"/>
    </div>
  )
}