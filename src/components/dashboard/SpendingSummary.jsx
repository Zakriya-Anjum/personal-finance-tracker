import { useCurrencyFormatter } from '../../context/SettingsContext'

function SpendingSummary({ topCategories }) {
  const formatCurrency = useCurrencyFormatter()

  if (topCategories.length === 0) {
    return <p className="mt-6 text-sm text-text-muted">No expenses recorded yet.</p>
  }

  return (
    <ul className="mt-6 space-y-4">
      {topCategories.map((item) => (
        <li key={item.category} className="flex items-center justify-between text-sm">
          <span className="font-medium text-text-secondary">{item.category}</span>
          <span className="text-text-muted">
            {formatCurrency(item.total)}{' '}
            <span className="text-text-subtle">({Math.round(item.percentage)}%)</span>
          </span>
        </li>
      ))}
    </ul>
  )
}

export default SpendingSummary