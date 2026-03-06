import React, { forwardRef } from "react";

const BuilderCanvas = forwardRef(({ selectedFinish, selectedPickguard, selectedNeck, selectedTestforma }, ref) => {
  const hasAnything = selectedFinish || selectedPickguard || selectedNeck;

  // build a class list that includes the testforma slug so we can apply
  // type-specific styling (tele vs strat, etc.)
  const classNames = ["builder-canvas"];
  if (selectedTestforma && selectedTestforma.nev) {
    const slug = selectedTestforma.nev.toLowerCase().replace(/\s+/g, "-");
    classNames.push(`testforma-${slug}`);
  }

  return (
    <div ref={ref} className={classNames.join(" ")}>
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
          className="guitar-layer guitar-finish"
          style={{ zIndex: selectedFinish.zIndex ?? 10 }}
          onError={e => { e.target.style.display = "none"; }}
        />
      )}

      {selectedPickguard && (
        <img
          key={selectedPickguard.id}
          src={selectedPickguard.kepUrl}
          alt={selectedPickguard.nev}
          className="guitar-layer guitar-pickguard"
          style={{ zIndex: selectedPickguard.zIndex ?? 20 }}
          onError={e => { e.target.style.display = "none"; }}
        />
      )}

      {selectedNeck && (
        <img
          key={selectedNeck.id}
          src={selectedNeck.kepUrl}
          alt={selectedNeck.nev}
          className="guitar-layer guitar-neck"
          style={{ zIndex: selectedNeck.zIndex ?? 30 }}
          onError={e => { e.target.style.display = "none"; }}
        />
      )}
    </div>
  );
});

BuilderCanvas.displayName = "BuilderCanvas";
export default BuilderCanvas;