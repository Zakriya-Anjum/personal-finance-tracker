// import { Pencil, Trash2 } from 'lucide-react'

// // `isDeleting` replaces the dimming that Transactions.jsx previously
// // applied via an external wrapper <div> — that wrapper was also
// // invalid HTML (a <div> nested directly inside a <ul>, where only
// // <li> is permitted). Handling it here means TransactionItem renders
// // as a single, valid <li>, and the dimming logic lives with the
// // component it actually affects.
// function TransactionItem({
//   icon: Icon,
//   iconBg,
//   iconColor,
//   title,
//   category,
//   date,
//   amount,
//   isPositive,
//   onEdit,
//   onDelete,
//   isDeleting = false,
// }) {
//   const hasActions = Boolean(onEdit || onDelete)

//   return (
//     <li
//       className={`group flex items-center gap-4 py-4 transition-opacity ${isDeleting ? 'opacity-50' : ''}`}
//     >
//       <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
//         <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={2} />
//       </div>

//       <div className="min-w-0 flex-1">
//         <p className="truncate text-sm font-medium text-slate-800">{title}</p>
//         <p className="mt-0.5 text-xs text-slate-400">
//           {category} · {date}
//         </p>
//       </div>

//       {/* The amount is now the visual anchor of the row — larger and
//           bolder than title, which previously had equal-or-greater
//           visual weight despite being the less important fact in a
//           finance row. The +/- prefix means the distinction never
//           depends on color alone. */}
//       <p className={`shrink-0 text-base font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
//         {isPositive ? '+' : '-'}${amount}
//       </p>

//       {hasActions && (
//         // Hidden at rest on desktop (md:opacity-0), revealed on hover
//         // OR when any control inside receives keyboard focus
//         // (group-focus-within) — so a keyboard user tabbing to Edit/
//         // Delete never encounters invisible controls; the reveal
//         // happens synchronously with focus, not after a hover that
//         // never occurs. Below md (touch), there's no hover concept at
//         // all, so actions stay permanently visible by default — no
//         // device-detection JS, purely responsive CSS.
//         <div className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
//           {onEdit && (
//             <button
//               type="button"
//               onClick={onEdit}
//               aria-label={`Edit ${title}`}
//               className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-gray-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
//             >
//               <Pencil className="h-4 w-4" strokeWidth={2} />
//             </button>
//           )}
//           {onDelete && (
//             <button
//               type="button"
//               onClick={onDelete}
//               aria-label={`Delete ${title}`}
//               className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-100"
//             >
//               <Trash2 className="h-4 w-4" strokeWidth={2} />
//             </button>
//           )}
//         </div>
//       )}
//     </li>
//   )
// }

// export default TransactionItem









import { Pencil, Trash2 } from 'lucide-react'
import { useCurrencyFormatter } from '../../context/SettingsContext'

function TransactionItem({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  category,
  date,
  amount,
  isPositive,
  onEdit,
  onDelete,
  isDeleting = false,
}) {
  const formatCurrency = useCurrencyFormatter()
  const hasActions = Boolean(onEdit || onDelete)

  return (
    <li
      className={`group flex items-center gap-4 py-4 transition-opacity ${isDeleting ? 'opacity-50' : ''}`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={2} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-secondary">{title}</p>
        <p className="mt-0.5 text-xs text-text-muted">
          {category} · {date}
        </p>
      </div>

      <p className={`shrink-0 text-base font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
        {isPositive ? '+' : '-'}{formatCurrency(Number(amount))}
      </p>

      {hasActions && (
        <div className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Edit ${title}`}
              className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-hover hover:text-text-secondary focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-500/30"
            >
              <Pencil className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              aria-label={`Delete ${title}`}
              className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-500/30"
            >
              <Trash2 className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
        </div>
      )}
    </li>
  )
}

export default TransactionItem