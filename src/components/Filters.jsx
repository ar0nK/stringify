import React, { useState, useEffect } from "react";
import '../style/FilterSlider.css'

export default function Filters({ onFiltersChange, products = [] }) {

  const [guitarTypes, setGuitarTypes] = useState({ electric: false, acoustic: false, bass: false })

  const TYPE_ALIASES = {
    electric: ["electric", "elektromos", "strat", "tele", "les paul", "sg", "jazzmaster", "superstrat", "explorer", "flying v"],
    acoustic: ["acoustic", "akusztikus", "dreadnought", "klasszikus", "classical", "nylon", "western", "folk", "parlor", "auditorium", "jumbo"],
    bass: ["bass", "basszus", "p-bass", "precision bass", "j-bass", "jazz bass"]
  }

  const CATEGORY_ID_MAP = { 1: "electric", 2: "acoustic", 3: "bass" };

  const normalizeText = (value) =>
    value.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const NORMALIZED_ALIASES = Object.fromEntries(
    Object.entries(TYPE_ALIASES).map(([key, aliases]) => [key, aliases.map(normalizeText)])
  );

  const resolveTypeFromText = (text) => {
    const haystack = normalizeText(text);
    return Object.entries(NORMALIZED_ALIASES).find(([, aliases]) =>
      aliases.some(alias => haystack.includes(alias))
    )?.[0] ?? null;
  };

  const [sortBy, setSortBy] = useState(null);
  const [priceEnabled, setPriceEnabled] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const minAr = products.length ? Math.min(...products.map(p => p.price)) : 0;
  const maxAr = products.length ? Math.max(...products.map(p => p.price)) : 1000000;

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

  const handleGuitarTypeChange = (type) => {
    setGuitarTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSortChange = (sort) => {
    setSortBy(prev => (prev === sort ? null : sort));
  };

  const handleApplyFilters = () => {
    let filtered = [...products];

    const selectedTypes = Object.entries(guitarTypes)
      .filter(([_, selected]) => selected)
      .map(([key]) => key)

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(guitar => {
        const categoryId = Number(
          guitar.categoryId ?? guitar.categoryID ?? guitar.category_id ??
          guitar.kategoriaId ?? guitar.category?.id ?? guitar.category?.categoryId ??
          guitar.category?.categoryID ?? guitar.category?.category_id ??
          guitar.kategoria?.id ?? guitar.category
        );
        if (Number.isFinite(categoryId) && CATEGORY_ID_MAP[categoryId]) {
          return selectedTypes.includes(CATEGORY_ID_MAP[categoryId]);
        }

        const explicitType = [guitar.type, guitar.guitarType, guitar.category?.name ?? guitar.category].find(Boolean);
        if (explicitType) {
          const resolvedExplicit = resolveTypeFromText(explicitType);
          if (resolvedExplicit) return selectedTypes.includes(resolvedExplicit);
        }

        const shortDescription = Array.isArray(guitar.shortDescription)
          ? guitar.shortDescription.join(" ")
          : guitar.shortDescription;

        const fallbackText = [guitar.title, guitar.previewDescription, shortDescription].filter(Boolean).join(" ");
        const resolvedFallback = fallbackText ? resolveTypeFromText(fallbackText) : null;
        return resolvedFallback ? selectedTypes.includes(resolvedFallback) : false;
      })
    }

    if (priceEnabled) {
      filtered = filtered.filter(g => g.price >= priceRange[0] && g.price <= priceRange[1]);
    }

    if (sortBy === 'abc') filtered.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === 'priceAsc') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'priceDesc') filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === 'popular') filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));

    onFiltersChange(filtered);
  };

  const minPercent = ((priceRange[0] - minAr) / (maxAr - minAr)) * 100;
  const maxPercent = ((priceRange[1] - minAr) / (maxAr - minAr)) * 100;

  return (
    <div className="p-3 rounded border bg-body-tertiary">
      <h6>Filterek</h6>
      <div className="mb-3 text-start">
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="type-electric" checked={guitarTypes.electric} onChange={() => handleGuitarTypeChange("electric")} />
          <label className="form-check-label" htmlFor="type-electric">Elektromos gitárok</label>
        </div>
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="type-acoustic" checked={guitarTypes.acoustic} onChange={() => handleGuitarTypeChange("acoustic")} />
          <label className="form-check-label" htmlFor="type-acoustic">Akusztikus gitárok</label>
        </div>
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="type-bass" checked={guitarTypes.bass} onChange={() => handleGuitarTypeChange("bass")} />
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