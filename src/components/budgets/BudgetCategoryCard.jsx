import { Pencil, Trash2 } from 'lucide-react'
import Card from '../ui/Card'
import { useCurrencyFormatter } from '../../context/SettingsContext'

const statusStyles = {
  'On Track': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  'Near Limit': 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  'Over Budget': 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
}

const barColors = {
  'On Track': 'bg-emerald-500',
  'Near Limit': 'bg-amber-500',
  'Over Budget': 'bg-rose-500',
}

function BudgetCategoryCard({
  icon: Icon,
  iconBg,
  iconColor,
  category,
  limit,
  spent,
  remaining,
  percentage,
  status,
  onEdit,
  onDelete,
}) {
  const formatCurrency = useCurrencyFormatter()

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-secondary">{category}</h3>
            <p className="text-xs text-text-muted">{formatCurrency(limit)} monthly budget</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}>
            {status}
          </span>
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Edit ${category} budget`}
              className="rounded-lg p-1 text-text-muted hover:bg-surface-hover hover:text-text-secondary"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              aria-label={`Delete ${category} budget`}
              className="rounded-lg p-1 text-text-muted hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 h-2 w-full rounded-full bg-surface-muted">
        <div className={`h-2 rounded-full ${barColors[status]}`} style={{ width: `${percentage}%` }} />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-text-muted">
          <span className="font-medium text-text-secondary">{formatCurrency(spent)}</span> spent
        </span>
        <span className="text-text-muted">{formatCurrency(remaining)} remaining</span>
      </div>
    </Card>
  )
}

export default BudgetCategoryCard