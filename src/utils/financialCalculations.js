// Pure calculation functions — no React, no Context, no JSX. Each one
// takes plain data in and returns a plain number out. This is what
// makes them reusable anywhere data needs to be summarized: Dashboard
// today, Analytics/Budgets/Reports later, or even a backend endpoint
// that needs the identical math someday.

// amount is stored as a string like "84.32" or "6,200.00" — commas
// have to be stripped before Number() can read it correctly. Kept here
// rather than duplicated, since every function below needs it.
function parseAmount(amountString) {
  return Number(amountString.replace(/,/g, ''))
}

// reduce() is the right tool here because we're collapsing an entire
// array down into a single value (a running total) — that's exactly
// what reduce() is built for. `sum` is the accumulator: it starts at 0
// and carries forward the running total from one transaction to the
// next until every item has been folded in.
export function calculateTotalIncome(transactions) {
  return transactions
    .filter((transaction) => transaction.isPositive)
    .reduce((sum, transaction) => sum + parseAmount(transaction.amount), 0)
}

export function calculateTotalExpenses(transactions) {
  return transactions
    .filter((transaction) => !transaction.isPositive)
    .reduce((sum, transaction) => sum + parseAmount(transaction.amount), 0)
}

// Takes already-calculated income/expenses rather than the raw
// transactions array — this avoids reduce()-ing over the same data
// twice when a caller (like Dashboard) already has both totals handy.
export function calculateBalance(totalIncome, totalExpenses) {
  return totalIncome - totalExpenses
}

// Division by zero is a real risk here: a brand-new user with no
// income yet would otherwise see NaN or Infinity rendered on screen.
// Returning 0 in that case is a safe, sensible default.
export function calculateSavingsRate(totalIncome, totalExpenses) {
  if (totalIncome === 0) return 0
  return ((totalIncome - totalExpenses) / totalIncome) * 100
}