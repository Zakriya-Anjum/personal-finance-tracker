function ActionCard({ icon: Icon, label }) {
  return (
    <button
      type="button"
      className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-surface p-5 shadow-sm dark:shadow-none transition-colors hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-muted">
        <Icon className="h-5 w-5 text-text-secondary" strokeWidth={2} />
      </div>
      <span className="text-sm font-medium text-text-secondary">{label}</span>
    </button>
  )
}

export default ActionCard