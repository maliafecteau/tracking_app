export default function ToggleBtns({ options, value, onChange, className = '' }) {
  return (
    <div className={`toggle-buttons ${className}`.trim()}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`toggle-btn ${value === option.value ? 'active' : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
