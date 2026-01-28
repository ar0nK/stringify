import React, { useState, useEffect } from 'react'
import guitars from '../temp/guitars.json'

let minAr = Infinity
let maxAr = -Infinity

for (let i = 0; i < guitars.length; i++) {
  if (guitars[i].price > maxAr) maxAr = guitars[i].price
  if (guitars[i].price < minAr) minAr = guitars[i].price
}

export default function Filters() {
  const [price, setPrice] = useState(null)
  const [rating, setRating] = useState(null)
  const [isOpen, setIsOpen] = useState(true)
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute("data-bs-theme") || "light")

  useEffect(() => {
    const el = document.documentElement
    const update = () => setTheme(el.getAttribute("data-bs-theme") || "light")
    update()
    const observer = new MutationObserver(update)
    observer.observe(el, { attributes: true, attributeFilter: ["data-bs-theme"] })
    return () => observer.disconnect()
  }, [])

  const formatPrice = (price) => price.toLocaleString('hu-HU')

  return (
    <div className="p-3 rounded border bg-body-tertiary text-body">
      <button
        className="btn btn-link text-decoration-none w-100 text-start p-0 d-flex justify-content-between align-items-center mb-3 text-body"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h6 className="mb-0"><i className='bi bi-funnel me-2'></i>Filterek</h6>
        <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </button>

      {isOpen && (
        <div>
          <form>
            <div className="mb-3 text-start">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="electric" name="type" value="electric" />
                <label className="form-check-label text-start" htmlFor="electric">Elektromos gitárok</label>
              </div>
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="acoustic" name="type" value="acoustic" />
                <label className="form-check-label text-start" htmlFor="acoustic">Akusztikus gitárok</label>
              </div>
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="bass" name="type" value="bass" />
                <label className="form-check-label text-start" htmlFor="bass">Basszus gitárok</label>
              </div>
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="sortAbc" name="sort" value="abc" />
                <label className="form-check-label text-start" htmlFor="sortAbc">ABC szerint</label>
              </div>
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="sortPopular" name="sort" value="popular" />
                <label className="form-check-label text-start" htmlFor="sortPopular">Népszerűség szerint</label>
              </div>
            </div>

            <hr className="my-3" />

            <div className="mb-4">
              <label className="form-label fw-bold small text-start d-block">Értékelés</label>
              <input
                type="range"
                min={1.0}
                max={5.0}
                step={0.1}
                value={rating || 1.0}
                className="form-range"
                id="ratingRange"
                onChange={(e) => setRating(e.target.value)}
                style={{ accentColor: '#0d6efd' }}
              />
              <div className="d-flex justify-content-between small text-body-secondary">
                <span>1.0</span>
                <span>5.0</span>
              </div>
              <div className="text-center mt-2 fw-bold">
                {Number(rating || 1.0).toFixed(1)}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold small text-start d-block">Ár</label>
              <input
                type="range"
                min={minAr}
                max={maxAr}
                value={price || maxAr}
                className="form-range"
                id="priceRange"
                onChange={(e) => setPrice(e.target.value)}
                style={{ accentColor: '#0d6efd' }}
              />
              <div className="d-flex justify-content-between small text-body-secondary">
                <span>{formatPrice(minAr)} Ft</span>
                <span>{formatPrice(maxAr)} Ft</span>
              </div>
              <div className="text-center mt-2 fw-bold">
                {formatPrice(Number(price || maxAr))} Ft
              </div>
            </div>

            <button type="button" className="btn btn-danger btn-sm w-100">Frissítés</button>
          </form>
        </div>
      )}
    </div>
  )
}
