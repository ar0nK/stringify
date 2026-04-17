import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-body py-3">
      <hr className="m-0" />
      <div className="container-fluid px-4 px-lg-5 py-3 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
        <span className="text-body-secondary small">
          © 2025-2026 Stringify. Minden jog fenntartva.
        </span>

        <div className="d-flex gap-3">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="nav-link p-0" aria-label="Facebook">
            <i className="bi bi-facebook" style={{ fontSize: '1.2rem' }}></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="nav-link p-0" aria-label="Instagram">
            <i className="bi bi-instagram" style={{ fontSize: '1.2rem' }}></i>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="nav-link p-0" aria-label="YouTube">
            <i className="bi bi-youtube" style={{ fontSize: '1.2rem' }}></i>
          </a>
        </div>
      </div>
    </footer>
  );
}