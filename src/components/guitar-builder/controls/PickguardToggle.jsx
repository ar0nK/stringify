export default function PickguardToggle({ value, onChange }) {
    return (
      <label>
        <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />
        Pickguard
      </label>
    );
  }