function PageHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  actionIcon: ActionIcon,
  onAction = () => {},
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{eyebrow}</p>
        )}
        <h1 className={`${eyebrow ? 'mt-1' : ''} text-2xl font-semibold text-text-primary tracking-tight`}>
          {title}
        </h1>
        <p className="mt-1 text-sm text-text-muted">{description}</p>
      </div>

      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          {ActionIcon && <ActionIcon className="h-4 w-4" strokeWidth={2.5} />}
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default PageHeader