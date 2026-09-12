// Pure grouping logic — no React, no JSX. Takes an ALREADY sorted
// (chronologically) list and buckets consecutive same-date items
// under a shared label. It assumes chronological input order; it is
// the caller's responsibility to only use this when the current sort
// is actually chronological (newest/oldest) — grouping an
// amount-or-alphabetically-sorted list would scatter same-date items
// across many single-item groups, which defeats the point of grouping.

function getTodayUTCString() {
  return new Date().toISOString().slice(0, 10)
}

function getYesterdayUTCString() {
  const yesterday = new Date()
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)
  return yesterday.toISOString().slice(0, 10)
}

// rawDate is already a "YYYY-MM-DD" string (see TransactionContext's
// mapBackendTransaction) — comparing it directly against today/
// yesterday computed the same UTC-based way avoids the timezone-shift
// bug that motivated rawDate's existence in the first place.
function getDateLabel(rawDate) {
  if (rawDate === getTodayUTCString()) return 'Today'
  if (rawDate === getYesterdayUTCString()) return 'Yesterday'

  return new Date(rawDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function groupTransactionsByDate(chronologicallySortedTransactions) {
  const groups = []
  let currentGroup = null

  chronologicallySortedTransactions.forEach((transaction) => {
    const label = getDateLabel(transaction.rawDate)

    if (!currentGroup || currentGroup.label !== label) {
      currentGroup = { label, transactions: [] }
      groups.push(currentGroup)
    }

    currentGroup.transactions.push(transaction)
  })

  return groups
}