export default function PickupControls({
    neckPickup,
    middlePickup,
    bridgePickup,
    setNeck,
    setMiddle,
    setBridge,
  }) {
    return (
      <>
        <label><input type="checkbox" checked={neckPickup} onChange={e => setNeck(e.target.checked)} /> Neck</label>
        <label><input type="checkbox" checked={middlePickup} onChange={e => setMiddle(e.target.checked)} /> Middle</label>
        <label><input type="checkbox" checked={bridgePickup} onChange={e => setBridge(e.target.checked)} /> Bridge</label>
      </>
    );
  }