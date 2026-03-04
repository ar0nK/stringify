import React from "react";
import OptionSelect from "./OptionSelect";

export default function BuilderOptions({
  testformak, finishek, pickguardok, nyakak,
  selectedTestforma, selectedFinish, selectedPickguard, selectedNeck,
  onTestformaChange, onFinishChange, onPickguardChange, onNeckChange,
}) {
  return (
    <div className="builder-options">
      <h5 className="fw-bold mb-4">Gitár konfiguráció</h5>

      <OptionSelect
        label="1. Testforma"
        value={selectedTestforma?.id ?? ""}
        onChange={id => {
          const found = testformak.find(t => t.id === Number(id));
          onTestformaChange(found ?? null);
        }}
        options={testformak.map(t => ({ label: t.nev, value: t.id }))}
        placeholder="Válassz testformát..."
      />

      {!selectedTestforma && (
        <p className="text-muted small fst-italic mt-2">
          A többi opció a testforma kiválasztása után válik elérhetővé.
        </p>
      )}

      <OptionSelect
        label="2. Finish (szín)"
        value={selectedFinish?.id ?? ""}
        onChange={id => {
          const found = finishek.find(f => f.id === Number(id));
          onFinishChange(found ?? null);
        }}
        options={finishek.map(f => ({ label: `${f.nev} (+${f.ar.toLocaleString("hu-HU")} Ft)`, value: f.id, previewUrl: f.kepUrl }))}
        placeholder="Válassz színt..."
        disabled={!selectedTestforma}
      />

      <OptionSelect
        label="3. Pickguard (opcionális)"
        value={selectedPickguard?.id ?? ""}
        onChange={id => {
          const found = pickguardok.find(p => p.id === Number(id));
          onPickguardChange(found ?? null);
        }}
        options={pickguardok.map(p => ({ label: `${p.nev} (+${p.ar.toLocaleString("hu-HU")} Ft)`, value: p.id, previewUrl: p.kepUrl }))}
        placeholder="Válassz pickguardot..."
        disabled={!selectedTestforma}
      />

      <OptionSelect
        label="4. Nyak"
        value={selectedNeck?.id ?? ""}
        onChange={id => {
          const found = nyakak.find(n => n.id === Number(id));
          onNeckChange(found ?? null);
        }}
        options={nyakak.map(n => ({ label: `${n.nev} (+${n.ar.toLocaleString("hu-HU")} Ft)`, value: n.id, previewUrl: n.kepUrl }))}
        placeholder="Válassz nyakat..."
        disabled={!selectedTestforma}
      />
    </div>
  );
}