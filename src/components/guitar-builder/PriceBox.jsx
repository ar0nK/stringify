import React, { useState } from "react";
import html2canvas from "html2canvas";
import { useAuth } from "../../context/AuthContext";

export default function PriceBox({ selectedTestforma, selectedFinish, selectedPickguard, selectedNeck, canvasRef }) {
  const { isAuthenticated, apiBase, authHeaders, addToCart } = useAuth();
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  const finishAr    = selectedFinish?.ar    ?? 0;
  const pickguardAr = selectedPickguard?.ar ?? 0;
  const neckAr      = selectedNeck?.ar      ?? 0;
  const total       = finishAr + pickguardAr + neckAr;

  const isComplete = selectedTestforma && selectedNeck;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert("A gitár kosárba helyezéséhez be kell jelentkezned!");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${apiBase}/api/egyedigitar/save`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          testformaId: selectedTestforma.id,
          finishId:    selectedFinish?.id    ?? null,
          pickguardId: selectedPickguard?.id ?? null,
          neckId:      selectedNeck.id,
        }),
      });

      if (!res.ok) throw new Error("Mentés sikertelen");

      const data = await res.json();

      await addToCart({
        id:            `egyedi-${data.id}`,
        title:         `Egyedi gitár (${selectedTestforma.nev})`,
        price:         total,
        image:         selectedFinish?.kepUrl ?? "",
        egyediGitarId: data.id,
        isAvailable:   true,
      });

      alert(`Egyedi gitár sikeresen kosárba helyezve! (ID: ${data.id})`);
    } catch (err) {
      console.error(err);
      alert("Hiba történt a mentés során. Kérjük, próbáld újra.");
    } finally {
      setSaving(false);
    }
  };

  const handleExportImage = async () => {
    if (!canvasRef?.current) {
      alert("Az exportálás sikertelen");
      return;
    }

    setExporting(true);
    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: "#f8f8f8",
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `gitar_${selectedTestforma?.nev?.replace(/\s+/g, "_")}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export hiba:", err);
      alert("Nem sikerült letölteni a képet. Próbáld újra!");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="builder-price-box">
      <h4 className="fw-bold">Összesítő</h4>

      <ul className="list-group list-group-flush mb-3">
        {selectedFinish && (
          <li className="list-group-item d-flex justify-content-between px-0">
            <span className="text-muted">Finish – {selectedFinish.nev}</span>
            <span>{finishAr.toLocaleString("hu-HU")} Ft</span>
          </li>
        )}
        {selectedPickguard && (
          <li className="list-group-item d-flex justify-content-between px-0">
            <span className="text-muted">Pickguard – {selectedPickguard.nev}</span>
            <span>{pickguardAr.toLocaleString("hu-HU")} Ft</span>
          </li>
        )}
        {selectedNeck && (
          <li className="list-group-item d-flex justify-content-between px-0">
            <span className="text-muted">Nyak – {selectedNeck.nev}</span>
            <span>{neckAr.toLocaleString("hu-HU")} Ft</span>
          </li>
        )}
        {!selectedFinish && !selectedPickguard && !selectedNeck && (
          <li className="list-group-item px-0 text-muted fst-italic">
            Még nincs kiválasztott alkatrész.
          </li>
        )}
      </ul>

      <div className="builder-price">{total.toLocaleString("hu-HU")} Ft</div>

      <button
        className="btn btn-danger w-100 mt-3"
        onClick={handleAddToCart}
        disabled={!isComplete || saving}
        title={!isComplete ? "Válassz testformát és nyakat a folytatáshoz" : ""}
      >
        {saving
          ? <><span className="spinner-border spinner-border-sm me-2" />Mentés...</>
          : isComplete
            ? "Kosárba teszem"
            : "Válassz testformát és nyakat"}
      </button>

      <button
        className="btn btn-outline-secondary w-100 mt-2"
        onClick={handleExportImage}
        disabled={!isComplete || exporting}
        title={!isComplete ? "Válassz testformát és nyakat az exportáláshoz" : ""}
      >
        {exporting
          ? <><span className="spinner-border spinner-border-sm me-2" />Exportálás...</>
          : isComplete
            ? "Kép letöltése"
            : "Nem elérhető"}
      </button>

      {!isAuthenticated && isComplete && (
        <p className="text-muted text-center small mt-2 mb-0">
          A kosárba helyezéshez <a href="/login">be kell jelentkezned</a>.
        </p>
      )}
    </div>
  );
}