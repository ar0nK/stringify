import React, { useState, useEffect } from 'react'

export default function GuitarForm() {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute("data-bs-theme") || "light")

  useEffect(() => {
    const el = document.documentElement
    const update = () => setTheme(el.getAttribute("data-bs-theme") || "light")
    update()
    const observer = new MutationObserver(update)
    observer.observe(el, { attributes: true, attributeFilter: ["data-bs-theme"] })
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`flex-grow-1 ${theme === "dark" ? "bg-dark text-light" : "bg-light"}`}>
      <select className="form-select mb-2 border-secondary">
        <option>Gitár testformája</option>
      </select>

      <select className="form-select mb-2 border-secondary">
        <option>Gitár testfája</option>
      </select>

      <select className="form-select mb-2 border-secondary">
        <option>Gitár nyakfája</option>
      </select>

      <select className="form-select mb-2 border-secondary">
        <option>Gitár pickupja</option>
      </select>

      <select className="form-select mb-2 border-secondary">
        <option>Gitár pickguard színek</option>
      </select>

      <select className="form-select mb-2 border-secondary">
        <option>Gitár finish</option>
        <option>Fekete</option>
        <option>Olympic Fehér</option>
        <option>Sunburst</option>
      </select>
    </div>
  )
}
