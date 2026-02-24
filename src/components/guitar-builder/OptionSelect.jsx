import React from "react";

export default function OptionSelect({ label, value, onChange, options, placeholder, disabled, optional }) {
  const selectedOption = options.find(o => String(o.value) === String(value));
  const previewSrc = selectedOption?.previewUrl ?? null;

  return (
    <div className="mb-4">
      <label className="form-label fw-semibold small mb-1">{label}</label>

      <div className="d-flex align-items-center gap-3">
        <select
          className="form-select"
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">{placeholder ?? "Válassz..."}</option>

          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {previewSrc && (
          <img
            src={previewSrc}
            alt={selectedOption?.label ?? ""}
            className="rounded border"
            style={{ width: 56, height: 56, objectFit: "cover", flexShrink: 0 }}
            onError={e => { e.target.style.display = "none"; }}
          />
        )}
      </div>

      {disabled && (
        <div className="form-text text-muted">Először válassz testformát.</div>
      )}
    </div>
  );
}