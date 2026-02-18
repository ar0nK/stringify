import React, { useState, useEffect } from "react";
import '../style/FilterSlider.css'

export default function Filters({ onFiltersChange, products = [] }) {

  const [guitarTypes, setGuitarTypes] = useState({
    electric: false,
    acoustic: false,
    bass: false
  })

  const TYPE_MAP = {
    electric: "Elektromos",
    acoustic: "Akusztikus",
    bass: "Basszus"
  }


  const [sortBy, setSortBy] = useState(null);
  const [priceEnabled, setPriceEnabled] = useState(false);
  const [ratingEnabled, setRatingEnabled] = useState(false);

  const [rating, setRating] = useState(1.0);
  const [isOpen, setIsOpen] = useState(true);

  // ár határok kiszámítása
  const minAr = products.length
    ? Math.min(...products.map(p => p.price))
    : 0;

  const maxAr = products.length
    ? Math.max(...products.map(p => p.price))
    : 1000000;

  // DOUBLE RANGE STATE
  const [priceRange, setPriceRange] = useState([minAr, maxAr]);

  useEffect(() => {
    setPriceRange([minAr, maxAr]);
  }, [minAr, maxAr]);

  const formatPrice = (price) =>
    price.toLocaleString("hu-HU");

  // ----------------------------
  // SLIDER HANDLERS
  // ----------------------------

  const handleMinPrice = (e) => {
    const value = Math.min(
      Number(e.target.value),
      priceRange[1] - 1
    );
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxPrice = (e) => {
    const value = Math.max(
      Number(e.target.value),
      priceRange[0] + 1
    );
    setPriceRange([priceRange[0], value]);
  };

  // ----------------------------

  const handleGuitarTypeChange = (type) => {
    setGuitarTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSortChange = (sort) => {
    setSortBy(prev => (prev === sort ? null : sort));
  };

  // ----------------------------
  // FILTER APPLY
  // ----------------------------

  const handleApplyFilters = () => {
    let filtered = [...products];

    const selectedTypes = Object.entries(guitarTypes)
      .filter(([_, selected]) => selected)
      .map(([key]) => TYPE_MAP[key])

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(guitar =>
        selectedTypes.includes(guitar.type)
      )
    }

    if (priceEnabled) {
      filtered = filtered.filter(
        g =>
          g.price >= priceRange[0] &&
          g.price <= priceRange[1]
      );
    }

    if (sortBy === 'abc') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    else if (sortBy === 'priceAsc') {
      filtered.sort((a, b) => a.price - b.price);
    }

    else if (sortBy === 'priceDesc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    else if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }

    onFiltersChange(filtered);
  };

  // slider százalékos track
  const minPercent =
    ((priceRange[0] - minAr) / (maxAr - minAr)) * 100;

  const maxPercent =
    ((priceRange[1] - minAr) / (maxAr - minAr)) * 100;

  return (
    <div className="p-3 rounded border bg-body-tertiary">

        <h6>Filterek</h6>



      <div className="mb-3 text-start">

        {["electric", "acoustic", "bass"].map(type => (
          <div className="form-check" key={type}>
            <input
              type="checkbox"
              className="form-check-input"
              checked={guitarTypes[type]}
              onChange={() => handleGuitarTypeChange(type)}
            />
            <label className="form-check-label">
              {type === "electric" && "Elektromos gitárok"}
              {type === "acoustic" && "Akusztikus gitárok"}
              {type === "bass" && "Basszus gitárok"}
            </label>
          </div>
        ))}

        <hr />

        {/* ================= ABC ================= */}

        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={sortBy === "abc"}
            onChange={() => handleSortChange("abc")}
          />
          <label className="form-check-label">
            ABC szerint
          </label>
        </div>
      </div>

      {/* ================= ÁR NÖVEKVŐ/CSÖKKENŐ ================= */}

      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="sortPriceAsc"
          checked={sortBy === 'priceAsc'}
          onChange={() => handleSortChange('priceAsc')}
        />
        <label className="form-check-label" htmlFor="sortPriceAsc">Ár szerint növekvő</label>
      </div>

      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="sortPriceDesc"
          checked={sortBy === 'priceDesc'}
          onChange={() => handleSortChange('priceDesc')}
        />
        <label className="form-check-label" htmlFor="sortPriceDesc">Ár szerint csökkenő</label>
      </div>


      {isOpen && (
        <>
          {/* ================= PRICE SLIDER ================= */}
          <div className="mb-4">

            <div className="d-flex justify-content-between">
              <label className="fw-bold small">Ár</label>

              <input
                type="checkbox"
                checked={priceEnabled}
                onChange={(e) => setPriceEnabled(e.target.checked)}
              />
            </div>

            <div className="range-slider position-relative mt-3">

              {/* TRACK */}
              <div
                className="slider-track"
                style={{
                  left: `${minPercent}%`,
                  right: `${100 - maxPercent}%`
                }}
              />

              {/* MIN */}
              <input
                type="range"
                min={minAr}
                max={maxAr}
                value={priceRange[0]}
                onChange={handleMinPrice}
                disabled={!priceEnabled}
              />

              {/* MAX */}
              <input
                type="range"
                min={minAr}
                max={maxAr}
                value={priceRange[1]}
                onChange={handleMaxPrice}
                disabled={!priceEnabled}
              />
            </div>

            <div className="d-flex justify-content-between mt-2 small">
              <span>{formatPrice(priceRange[0])} Ft</span>
              <span>{formatPrice(priceRange[1])} Ft</span>
            </div>

          </div>

          <button
            className="btn btn-danger w-100"
            onClick={handleApplyFilters}
          >
            Frissítés
          </button>
        </>
      )}
    </div>
  );
}