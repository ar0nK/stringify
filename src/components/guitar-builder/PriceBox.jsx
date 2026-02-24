import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function PriceBox({ selectedTestforma, selectedFinish, selectedPickguard, selectedNeck }) {
  const { isAuthenticated, apiBase, authHeaders, addToCart } = useAuth();
  const [saving, setSaving] = useState(false);

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

      {!isAuthenticated && isComplete && (
        <p className="text-muted text-center small mt-2 mb-0">
          A kosárba helyezéshez <a href="/login">be kell jelentkezned</a>.
        </p>
      )}
    </div>
  );
}