import React from "react";

export default function BuilderCanvas({ selectedFinish, selectedPickguard, selectedNeck }) {
  const hasAnything = selectedFinish || selectedPickguard || selectedNeck;

  return (
    <div className="builder-canvas">
      {!hasAnything && (
        <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
          <i className="bi bi-music-note-beamed fs-1 mb-2" />
          <span>Válassz testformát a kezdéshez</span>
        </div>
      )}

      {selectedFinish && (
        <img
          key={selectedFinish.id}
          src={selectedFinish.kepUrl}
          alt={selectedFinish.nev}
          className="guitar-layer"
          style={{ zIndex: selectedFinish.zIndex ?? 10 }}
          onError={e => { e.target.style.display = "none"; }}
        />
      )}

      {selectedPickguard && (
        <img
          key={selectedPickguard.id}
          src={selectedPickguard.kepUrl}
          alt={selectedPickguard.nev}
          className="guitar-layer"
          style={{ zIndex: selectedPickguard.zIndex ?? 20 }}
          onError={e => { e.target.style.display = "none"; }}
        />
      )}

      {selectedNeck && (
        <img
          key={selectedNeck.id}
          src={selectedNeck.kepUrl}
          alt={selectedNeck.nev}
          className="guitar-layer"
          style={{ zIndex: selectedNeck.zIndex ?? 30 }}
          onError={e => { e.target.style.display = "none"; }}
        />
      )}
    </div>
  );
}