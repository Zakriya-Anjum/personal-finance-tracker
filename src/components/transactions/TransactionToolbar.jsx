// import { Search, ArrowUpDown, X } from 'lucide-react'
// import Card from '../ui/Card'
// import FilterButton from './FilterButton'

// const filters = ['All', 'Income', 'Expenses']

// const sortOptions = [
//   { value: 'newest', label: 'Newest First' },
//   { value: 'oldest', label: 'Oldest First' },
//   { value: 'highest', label: 'Highest Amount' },
//   { value: 'lowest', label: 'Lowest Amount' },
//   { value: 'az', label: 'A → Z' },
//   { value: 'za', label: 'Z → A' },
// ]

// function TransactionToolbar({ searchQuery, onSearchChange, activeFilter, onFilterChange, sortBy, onSortChange }) {
//   return (
//     <Card className="p-4">
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div className="relative w-full sm:max-w-xs">
//           <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(event) => onSearchChange(event.target.value)}
//             placeholder="Search transactions..."
//             className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-9 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
//           />
//           {searchQuery && (
//             <button
//               type="button"
//               onClick={() => onSearchChange('')}
//               aria-label="Clear search"
//               className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:bg-gray-100 hover:text-slate-600"
//             >
//               <X className="h-3.5 w-3.5" strokeWidth={2} />
//             </button>
//           )}
//         </div>

//         {/* Filter pills and sort control now sit inside one visually
//             unified cluster (shared background, single rounded
//             container) rather than reading as two independent controls
//             placed side by side — a small, deliberately restrained
//             change, not a restructured filter panel. */}
//         <div className="flex flex-col gap-3 rounded-lg bg-gray-50 p-2 sm:flex-row sm:items-center sm:gap-2">
//           <div className="flex items-center gap-2">
//             {filters.map((filter) => (
//               <FilterButton
//                 key={filter}
//                 label={filter}
//                 isActive={activeFilter === filter}
//                 onClick={() => onFilterChange(filter)}
//               />
//             ))}
//           </div>

//           <div className="hidden h-6 w-px bg-gray-200 sm:block" aria-hidden="true" />

//           <div className="relative">
//             <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//             <select
//               value={sortBy}
//               onChange={(event) => onSortChange(event.target.value)}
//               aria-label="Sort transactions"
//               className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-8 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 sm:w-auto"
//             >
//               {sortOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>
//     </Card>
//   )
// }

// export default TransactionToolbar








import { Search, ArrowUpDown, X } from 'lucide-react'
import Card from '../ui/Card'
import FilterButton from './FilterButton'

const filters = ['All', 'Income', 'Expenses']

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'highest', label: 'Highest Amount' },
  { value: 'lowest', label: 'Lowest Amount' },
  { value: 'az', label: 'A → Z' },
  { value: 'za', label: 'Z → A' },
]

function TransactionToolbar({ searchQuery, onSearchChange, activeFilter, onFilterChange, sortBy, onSortChange }) {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search transactions..."
            className="w-full rounded-lg border border-border-strong bg-surface py-2 pl-9 pr-9 text-sm text-text-secondary placeholder:text-text-muted focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-500/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-text-muted hover:bg-surface-hover hover:text-text-secondary"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Filter pills and sort control now sit inside one visually
             unified cluster (shared background, single rounded
            container) rather than reading as two independent controls
            placed side by side — a small, deliberately restrained
             change, not a restructured filter panel. */}
        <div className="flex flex-col gap-3 rounded-lg bg-surface-muted p-2 sm:flex-row sm:items-center sm:gap-2">
          <div className="flex items-center gap-2">
            {filters.map((filter) => (
              <FilterButton
                key={filter}
                label={filter}
                isActive={activeFilter === filter}
                onClick={() => onFilterChange(filter)}
              />
            ))}
          </div>

          <div className="hidden h-6 w-px bg-border-strong sm:block" aria-hidden="true" />

          <div className="relative">
            <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <select
              value={sortBy}
              onChange={(event) => onSortChange(event.target.value)}
              aria-label="Sort transactions"
              className="w-full appearance-none rounded-lg border border-border-strong bg-surface py-2 pl-9 pr-8 text-sm text-text-secondary focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-500/30 sm:w-auto"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default TransactionToolbar