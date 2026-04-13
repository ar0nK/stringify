import React, { useState, useEffect } from "react";
import '../style/FilterSlider.css'

export default function Filters({ onFiltersChange, products = [] }) {

  const [guitarTypes, setGuitarTypes] = useState({ "1": false, "2": false, "3": false })

  const [sortBy, setSortBy] = useState(null);
  const [priceEnabled, setPriceEnabled] = useState(false);
  const [isOpen] = useState(true);

  const prices = products
    .map(p => p.price ?? p.ar)
    .map(value => Number(value))
    .filter(Number.isFinite);
  const minAr = prices.length ? Math.min(...prices) : 0;
  const maxAr = prices.length ? Math.max(...prices) : 1000000;

  const [priceRange, setPriceRange] = useState([minAr, maxAr]);

  useEffect(() => { setPriceRange([minAr, maxAr]); }, [minAr, maxAr]);

  const formatPrice = (price) => price.toLocaleString("hu-HU");

  const handleMinPrice = (e) => {
    const value = Math.min(Number(e.target.value), priceRange[1] - 1);
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxPrice = (e) => {
    const value = Math.max(Number(e.target.value), priceRange[0] + 1);
    setPriceRange([priceRange[0], value]);
  };

  const handleGuitarTypeChange = (typeId) => {
    setGuitarTypes(prev => ({ ...prev, [typeId]: !prev[typeId] }));
  };

  const handleSortChange = (sort) => {
    setSortBy(prev => (prev === sort ? null : sort));
  };

  const handleApplyFilters = () => {
    let filtered = [...products];

    const selectedTypeIds = Object.entries(guitarTypes)
      .filter(([_, selected]) => selected)
      .map(([key]) => Number(key))
      .filter(Number.isFinite)

    if (selectedTypeIds.length > 0) {
      filtered = filtered.filter(guitar => {
        const guitarTypeId = Number(
          guitar.guitarTypeId ?? guitar.GuitarTypeId ??
          guitar.gitarTipusId ?? guitar.GitarTipusId ??
          guitar.gitarTipusID ??
          guitar.typeId ?? guitar.TypeId
        );
        if (!Number.isFinite(guitarTypeId)) return false;
        return selectedTypeIds.includes(guitarTypeId);
      })
    }

    if (priceEnabled) {
      filtered = filtered.filter(g => {
        const price = g.price ?? g.ar;
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }

    if (sortBy === 'abc') filtered.sort((a, b) => (a.title ?? a.nev ?? "").localeCompare(b.title ?? b.nev ?? ""));
    else if (sortBy === 'priceAsc') filtered.sort((a, b) => (a.price ?? a.ar ?? 0) - (b.price ?? b.ar ?? 0));
    else if (sortBy === 'priceDesc') filtered.sort((a, b) => (b.price ?? b.ar ?? 0) - (a.price ?? a.ar ?? 0));
    else if (sortBy === 'popular') filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));

    onFiltersChange(filtered);
  };

  const rangeSpan = Math.max(maxAr - minAr, 1);
  const minPercent = ((priceRange[0] - minAr) / rangeSpan) * 100;
  const maxPercent = ((priceRange[1] - minAr) / rangeSpan) * 100;

  return (
    <div className="p-3 rounded border bg-body-tertiary">
      <h6>Filterek</h6>
      <div className="mb-3 text-start">
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="type-electric" checked={guitarTypes["1"]} onChange={() => handleGuitarTypeChange("1")} />
          <label className="form-check-label" htmlFor="type-electric">Elektromos gitárok</label>
        </div>
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="type-acoustic" checked={guitarTypes["2"]} onChange={() => handleGuitarTypeChange("2")} />
          <label className="form-check-label" htmlFor="type-acoustic">Akusztikus gitárok</label>
        </div>
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="type-bass" checked={guitarTypes["3"]} onChange={() => handleGuitarTypeChange("3")} />
          <label className="form-check-label" htmlFor="type-bass">Basszus gitárok</label>
        </div>
        <hr />
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="sort-abc" checked={sortBy === "abc"} onChange={() => handleSortChange("abc")} />
          <label className="form-check-label" htmlFor="sort-abc">ABC szerint</label>
        </div>
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="sort-priceAsc" checked={sortBy === 'priceAsc'} onChange={() => handleSortChange('priceAsc')} />
          <label className="form-check-label" htmlFor="sort-priceAsc">Ár szerint növekvő</label>
        </div>
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="sort-priceDesc" checked={sortBy === 'priceDesc'} onChange={() => handleSortChange('priceDesc')} />
          <label className="form-check-label" htmlFor="sort-priceDesc">Ár szerint csökkenő</label>
        </div>
      </div>
      {isOpen && (
        <>
          <div className="mb-4">
            <div className="d-flex justify-content-between">
              <label className="fw-bold small" htmlFor="price-toggle">Ár</label>
              <input type="checkbox" id="price-toggle" checked={priceEnabled} onChange={(e) => setPriceEnabled(e.target.checked)} />
            </div>
            <div className="range-slider position-relative mt-3">
              <div className="slider-track" style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }} />
              <input type="range" min={minAr} max={maxAr} value={priceRange[0]} onChange={handleMinPrice} disabled={!priceEnabled} />
              <input type="range" min={minAr} max={maxAr} value={priceRange[1]} onChange={handleMaxPrice} disabled={!priceEnabled} />
            </div>
            <div className="d-flex justify-content-between mt-2 small">
              <span>{formatPrice(priceRange[0])} Ft</span>
              <span>{formatPrice(priceRange[1])} Ft</span>
            </div>
          </div>
          <button className="btn btn-danger w-100" onClick={handleApplyFilters}>Frissítés</button>
        </>
      )}
    </div>
  );
}
