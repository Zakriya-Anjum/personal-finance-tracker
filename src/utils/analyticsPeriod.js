// Pure period-filtering logic — no React. Operates entirely on the
// "YYYY-MM-DD" rawDate string already produced by
// TransactionContext's mapBackendTransaction, using string slicing
// and lexicographic comparison rather than Date object arithmetic —
// ISO date strings sort correctly as plain strings, so this avoids
// any timezone-conversion risk entirely.

export const PERIOD_OPTIONS = [
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'last3Months', label: 'Last 3 Months' },
  { value: 'thisYear', label: 'This Year' },
  { value: 'allTime', label: 'All Time' },
]

function getTodayParts() {
  const [year, month, day] = new Date().toISOString().slice(0, 10).split('-').map(Number)
  return { year, month, day }
}

// Subtracts `n` months from a {year, month} pair, handling year
// rollover (e.g. Jan minus 1 month = December of the previous year).
function subtractMonths({ year, month }, n) {
  let totalMonths = year * 12 + (month - 1) - n
  const newYear = Math.floor(totalMonths / 12)
  const newMonth = (totalMonths % 12) + 1
  return { year: newYear, month: newMonth }
}

function pad(n) {
  return String(n).padStart(2, '0')
}

export function filterTransactionsByPeriod(transactions, period) {
  const today = getTodayParts()

  switch (period) {
    case 'thisMonth': {
      const prefix = `${today.year}-${pad(today.month)}`
      return transactions.filter((t) => t.rawDate.startsWith(prefix))
    }
    case 'lastMonth': {
      const { year, month } = subtractMonths(today, 1)
      const prefix = `${year}-${pad(month)}`
      return transactions.filter((t) => t.rawDate.startsWith(prefix))
    }
    case 'last3Months': {
      const { year, month } = subtractMonths(today, 2)
      const cutoff = `${year}-${pad(month)}-01`
      return transactions.filter((t) => t.rawDate >= cutoff)
    }
    case 'thisYear': {
      const prefix = `${today.year}-`
      return transactions.filter((t) => t.rawDate.startsWith(prefix))
    }
    case 'allTime':
    default:
      return transactions
  }
}