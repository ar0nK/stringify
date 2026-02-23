import React from "react";

export default function OptionSelect({ label, value, onChange, options }) {
  return (
    <div className="mb-3 text-start">

      <label className="form-label fw-bold small">
        {label}
      </label>

      <select
        className="form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

    </div>
  );
}