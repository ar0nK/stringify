import React, { forwardRef, useState, useEffect } from "react";

const BuilderCanvas = forwardRef(({ selectedFinish, selectedPickguard, selectedNeck, selectedTestforma }, ref) => {
  const hasAnything = selectedFinish || selectedPickguard || selectedNeck;

  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-bs-theme") || localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const current = document.documentElement.getAttribute("data-bs-theme") || "light";
      setTheme(current);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-bs-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const classNames = ["builder-canvas", `builder-canvas--${theme}`];
  if (selectedTestforma?.nev) {
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