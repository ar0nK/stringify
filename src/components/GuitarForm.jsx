import React from 'react'

export default function GuitarForm() {
  return (
    <div className="flex-grow-1">
      <select className="form-select mb-2 bg-light">
        <option>Gitár testformája</option>
      </select>

      <select className="form-select mb-2 bg-light">
        <option>Gitár testfája</option>
      </select>

      <select className="form-select mb-2 bg-light">
        <option>Gitár nyakfája</option>
      </select>

      <select className="form-select mb-2 bg-light">
        <option>Gitár pickupja</option>
      </select>

      <select className="form-select mb-2 bg-light">
        <option>Gitár pickguard színek</option>
      </select>

      <select className="form-select mb-2 bg-light">
        <option>Gitár finish</option>
        <option>Fekete</option>
        <option>Olympic Fehér</option>
        <option>Sunburst</option>
      </select>
    </div>
  )
}
