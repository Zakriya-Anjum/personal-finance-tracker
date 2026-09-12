// // Same status → color mapping BudgetCategoryCard already uses. Keeping
// // it here (rather than importing it from BudgetCategoryCard) is
// // intentional: this is a small, self-contained presentation detail
// // specific to how THIS component colors its own bar, not a shared
// // business rule — the business rule (what counts as "Near Limit") is
// // determineBudgetStatus() in utils, which both components already call.
// const barColors = {
//   'On Track': 'bg-emerald-500',
//   'Near Limit': 'bg-amber-500',
//   'Over Budget': 'bg-rose-500',
// }

// // `status` now drives the bar color instead of a hardcoded `barColor`
// // prop — this is what lets Dashboard's live-calculated status ("Near
// // Limit", "Over Budget") correctly color the bar without Dashboard
// // needing to know or pick a color itself.
// function BudgetProgressItem({ category, spent, limit, percentage, status }) {
//   return (
//     <div>
//       <div className="flex items-center justify-between text-sm">
//         <span className="font-medium text-text-secondary">{category}</span>
//         <span className="text-text-muted">
//           ${spent.toFixed(2)} <span className="text-text-subtle">/ ${limit.toFixed(2)}</span>
//         </span>
//       </div>
//       <div className="mt-2 h-2 w-full rounded-full bg-surface-muted">
//         <div
//           className={`h-2 rounded-full ${barColors[status]}`}
//           style={{ width: `${percentage}%` }}
//         />
//       </div>
//     </div>
//   )
// }

// export default BudgetProgressItem











import { useCurrencyFormatter } from '../../context/SettingsContext'

const barColors = {
  'On Track': 'bg-emerald-500',
  'Near Limit': 'bg-amber-500',
  'Over Budget': 'bg-rose-500',
}

function BudgetProgressItem({ category, spent, limit, percentage, status }) {
  const formatCurrency = useCurrencyFormatter()

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-text-secondary">{category}</span>
        <span className="text-text-muted">
          {formatCurrency(spent)} <span className="text-text-subtle">/ {formatCurrency(limit)}</span>
        </span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-surface-muted">
        <div
          className={`h-2 rounded-full ${barColors[status]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default BudgetProgressItem