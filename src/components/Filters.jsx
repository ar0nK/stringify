import React, { useState, useEffect } from 'react'

export default function Filters({ onFiltersChange, products = [] }) {
  const [guitarTypes, setGuitarTypes] = useState({
    electric: false,
    acoustic: false,
    bass: false
  })
  const [sortBy, setSortBy] = useState(null)
  const [priceEnabled, setPriceEnabled] = useState(false)
  const [price, setPrice] = useState(null)
  const [ratingEnabled, setRatingEnabled] = useState(false)
  const [rating, setRating] = useState(1.0)
  const [isOpen, setIsOpen] = useState(true)
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute("data-bs-theme") || "light")

  const minAr = products.length > 0 ? Math.min(...products.map(p => p.price)) : 0
  const maxAr = products.length > 0 ? Math.max(...products.map(p => p.price)) : 1000000

  useEffect(() => {
    if (price === null) setPrice(maxAr)
  }, [maxAr, price])

  useEffect(() => {
    const el = document.documentElement
    const update = () => setTheme(el.getAttribute("data-bs-theme") || "light")
    update()
    const observer = new MutationObserver(update)
    observer.observe(el, { attributes: true, attributeFilter: ["data-bs-theme"] })
    return () => observer.disconnect()
  }, [])

  const formatPrice = (price) => price.toLocaleString('hu-HU')

  const handleGuitarTypeChange = (type) => {
    setGuitarTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const handleSortChange = (sort) => {
    setSortBy(prev => prev === sort ? null : sort)
  }

  const handleApplyFilters = () => {
    let filtered = [...products]

    const selectedTypes = Object.entries(guitarTypes)
      .filter(([_, isSelected]) => isSelected)
      .map(([type, _]) => type)

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(guitar => {
        const guitarType = guitar.type?.toLowerCase() || ''
        return selectedTypes.some(type => guitarType.includes(type))
      })
    }

    if (ratingEnabled && rating !== null) {
      filtered = filtered.filter(guitar => guitar.rating >= rating)
    }

    if (priceEnabled && price !== null) {
      filtered = filtered.filter(guitar => guitar.price <= price)
    }

    if (sortBy === 'abc') {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
    }

    onFiltersChange(filtered)
  }

  return (
    <div className="p-3 rounded border bg-body-tertiary text-body" style={{ width: '100%' }}>
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
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  id="electric" 
                  checked={guitarTypes.electric}
                  onChange={() => handleGuitarTypeChange('electric')}
                />
                <label className="form-check-label text-start" htmlFor="electric">Elektromos gitárok</label>
              </div>
              <div className="form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  id="acoustic" 
                  checked={guitarTypes.acoustic}
                  onChange={() => handleGuitarTypeChange('acoustic')}
                />
                <label className="form-check-label text-start" htmlFor="acoustic">Akusztikus gitárok</label>
              </div>
              <div className="form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  id="bass" 
                  checked={guitarTypes.bass}
                  onChange={() => handleGuitarTypeChange('bass')}
                />
                <label className="form-check-label text-start" htmlFor="bass">Basszus gitárok</label>
              </div>
              <div className="form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  id="sortAbc" 
                  checked={sortBy === 'abc'}
                  onChange={() => handleSortChange('abc')}
                />
                <label className="form-check-label text-start" htmlFor="sortAbc">ABC szerint</label>
              </div>
              <div className="form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  id="sortPopular" 
                  checked={sortBy === 'popular'}
                  onChange={() => handleSortChange('popular')}
                />
                <label className="form-check-label text-start" htmlFor="sortPopular">Népszerűség szerint</label>
              </div>
            </div>

            <hr className="my-3" />

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label fw-bold small text-start mb-0">Értékelés</label>
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="ratingToggle"
                    checked={ratingEnabled}
                    onChange={(e) => setRatingEnabled(e.target.checked)}
                  />
                </div>
              </div>
              <input
                type="range"
                min={1.0}
                max={5.0}
                step={0.1}
                value={rating}
                className="form-range"
                id="ratingRange"
                onChange={(e) => setRating(e.target.value)}
                disabled={!ratingEnabled}
                style={{ accentColor: '#0d6efd', opacity: ratingEnabled ? 1 : 0.5 }}
              />
              <div className="d-flex justify-content-between small text-body-secondary">
                <span>1.0</span>
                <span>5.0</span>
              </div>
              <div className="text-center mt-2 fw-bold">
                {Number(rating).toFixed(1)}
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label fw-bold small text-start mb-0">Ár</label>
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="priceToggle"
                    checked={priceEnabled}
                    onChange={(e) => setPriceEnabled(e.target.checked)}
                  />
                </div>
              </div>
              <input
                type="range"
                min={minAr}
                max={maxAr}
                value={price || maxAr}
                className="form-range"
                id="priceRange"
                onChange={(e) => setPrice(e.target.value)}
                disabled={!priceEnabled}
                style={{ accentColor: '#0d6efd', opacity: priceEnabled ? 1 : 0.5 }}
              />
              <div className="d-flex justify-content-between small text-body-secondary">
                <span>{formatPrice(minAr)} Ft</span>
                <span>{formatPrice(maxAr)} Ft</span>
              </div>
              <div className="text-center mt-2 fw-bold">
                {formatPrice(Number(price || maxAr))} Ft
              </div>
            </div>

            <button 
              type="button" 
              className="btn btn-danger btn-sm w-100"
              onClick={handleApplyFilters}
            >
              Frissítés
            </button>
          </form>
        </div>
      )}
    </div>
  )
}