import React, { useState } from 'react'
import NavBar from '../components/NavBar'
import GuitarBuilderForm from '../components/GuitarForm'
import '../style/GuitarBuilder.css'
import StratocasterSVG from '../components/guitar-builder/controls/svg/StratocasterSVG'

export default function GuitarBuilder() {
  const [view, setView] = useState('front')
  const [bodyColor, setBodyColor] = useState('#000000')
  const [pickguard, setPickguard] = useState(true)
  const [neckPickup, setNeckPickup] = useState('single-coil')
  const [middlePickup, setMiddlePickup] = useState('single-coil')
  const [bridgePickup, setBridgePickup] = useState('single-coil')

  const ViewButton = ({ label, value }) => (
    <button
      type="button"
      onClick={() => setView(value)}
      className={`btn btn-sm rounded-pill me-2 ${view === value ? 'btn-danger' : 'btn-light'
        }`}
    >
      {label}
    </button>
  )

  return (
    <>
      <NavBar />

      <form className="container-fluid builder-container">
        <div className="row gx-4">

          <div className="col-12 col-md-4 col-lg-3 d-flex">
            <GuitarBuilderForm 
              bodyColor={bodyColor}
              setBodyColor={setBodyColor}
              pickguard={pickguard}
              setPickguard={setPickguard}
              neckPickup={neckPickup}
              setNeckPickup={setNeckPickup}
              middlePickup={middlePickup}
              setMiddlePickup={setMiddlePickup}
              bridgePickup={bridgePickup}
              setBridgePickup={setBridgePickup}
            />
            <div className="vr ms-3 d-none d-md-block" />
          </div>

          <div className="col-12 col-md-8 col-lg-6 d-flex justify-content-center my-4 my-lg-0">
            <div className="builder-preview position-relative w-100">

              <div className="view-toggle">
                <ViewButton label="Előli nézet" value="front" />
                <ViewButton label="Hátsó nézet" value="back" />
              </div>

              <div className="h-100 d-flex align-items-center justify-content-center">
                {view === 'front' && (
                  <StratocasterSVG
                    bodyColor={bodyColor}
                    showPickguard={pickguard}
                    neckPickup={neckPickup}
                    middlePickup={middlePickup}
                    bridgePickup={bridgePickup}
                  />
                )}

                {view === 'back' && (
                  <div className="text-muted">
                    Hátsó nézet (később SVG)
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-3 text-center d-flex flex-column justify-content-center">
            <h2 className="fw-bold">Teljes ár:</h2>

            <div className="fw-normal mx-auto builder-price">
              999,999 Ft
            </div>

            <div className="d-grid gap-3 px-3 px-lg-0">
              <button type="submit" className="btn btn-primary-custom">
                Kosárba
              </button>

              <button type="button" className="btn btn-save-custom">
                Termék elmentése
              </button>

              <button type="reset" className="btn btn-reset-custom">
                Újrakezdés
              </button>
            </div>
          </div>

        </div>
      </form>
    </>
  )
}