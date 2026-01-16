import React, { useState } from 'react'
import NavBar from '../components/NavBar'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function GuitarBuilder() {
  const [view, setView] = useState('front')

  return (
    <div>
      <NavBar />

      <form className="container-fluid mt-5 pt-4">
        <div className="row gx-4 align-items-stretch">
          <div className="col-12 col-md-4 col-lg-3 d-flex">
            <div className="d-flex w-100">
              <div className="flex-grow-1">
                <select className="form-select mb-2">
                  <option>Gitár testformája</option>
                </select>
                <select className="form-select mb-2">
                  <option>Gitár testfája</option>
                </select>
                <select className="form-select mb-2">
                  <option>Gitár nyakfája</option>
                </select>
                <select className="form-select mb-2">
                  <option>Gitár pickupja</option>
                </select>
                <select className="form-select mb-2">
                  <option>Gitár pickguard színek</option>
                </select>
                <select className="form-select">
                  <option>Gitár finish</option>
                  <option>Fekete</option>
                  <option>Olympic Fehér</option>
                  <option>Sunburst</option>
                </select>
              </div>
              <div className="vr ms-3 d-none d-md-block"></div>
            </div>
          </div>
          <div className="col-12 col-md-8 col-lg-6 d-flex justify-content-center align-items-center my-4 my-lg-0">
            <div
              className="position-relative w-100"
              style={{
                maxWidth: '620px',
                aspectRatio: '1 / 1',
                backgroundColor: '#e0e0e0',
                border: '1px solid #888'
              }}
            >
              <div className="position-absolute top-0 start-0 p-2">
                <button
                  type="button"
                  onClick={() => setView('front')}
                  className={`btn btn-sm rounded-pill me-2 ${
                    view === 'front' ? 'btn-danger' : 'btn-light'
                  }`}
                >
                  Előli nézet
                </button>

                <button
                  type="button"
                  onClick={() => setView('back')}
                  className={`btn btn-sm rounded-pill ${
                    view === 'back' ? 'btn-danger' : 'btn-light'
                  }`}
                >
                  Hátsó nézet
                </button>
              </div>

              <div className="h-100 d-flex justify-content-center align-items-center text-muted">
                {view === 'front' ? 'Előli nézet' : 'Hátsó nézet'}
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-3 text-center d-flex flex-column justify-content-center">
            <h2 className="fw-bold">Teljes ár:</h2>

            <div
              className="fw-bold mx-auto"
              style={{
                fontSize: '2.2rem',
                borderBottom: '2px solid black',
                paddingBottom: '10px',
                marginBottom: '25px',
                maxWidth: '220px'
              }}
            >
              999,999 Ft
            </div>

            <div className="d-grid gap-3 px-3 px-lg-0">
              <button
                type="submit"
                className="btn text-white"
                style={{ backgroundColor: '#ff6b6b' }}
              >
                Kosárba
              </button>

              <button
                type="button"
                className="btn text-white"
                style={{ backgroundColor: '#8fbdb6' }}
              >
                Termék elmentése
              </button>

              <button
                type="reset"
                className="btn text-white"
                style={{ backgroundColor: '#b0ad6f' }}
              >
                Újrakezdés
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
