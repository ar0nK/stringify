export default function FinishSelect({ value, onChange }) {
    return (
      <select value={value} onChange={e => onChange(e.target.value)}>
        <option value="#000000">Black</option>
        <option value="#ff0000">Red</option>
        <option value="#ffffff">White</option>
      </select>
    );
  }