function EmptyState({ icon: Icon, title, description, buttonLabel, onButtonClick }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted">
        <Icon className="h-6 w-6 text-text-muted" strokeWidth={2} />
      </div>
      <p className="mt-4 text-sm font-medium text-text-secondary">{title}</p>
      <p className="mt-1 text-xs text-text-muted">{description}</p>

      {buttonLabel && (
        <button
          type="button"
          onClick={onButtonClick}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          {buttonLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyState