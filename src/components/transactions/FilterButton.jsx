// A single filter pill. Purely visual — clicking it does not filter
// anything yet. `isActive` is passed in from the parent's local state
// just to control which pill looks selected.
function FilterButton({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-emerald-600 text-white shadow-sm'
          : 'bg-surface text-text-secondary border border-border-strong hover:bg-surface-hover'
      }`}
    >
      {label}
    </button>
  )
}

export default FilterButton