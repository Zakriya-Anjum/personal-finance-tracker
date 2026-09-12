// Pure budget calculations — no React, no Context, no JSX. Same rule
// as financialCalculations.js: plain data in, plain values out. This
// keeps them reusable by Analytics later, and testable on their own
// without needing a component tree or a Provider to run them.

// amount is stored as a string like "84.32" or "6,200.00" — same
// parsing helper used in financialCalculations.js and Transactions.jsx.
// It's small enough that duplicating it here (rather than importing
// across utils files) keeps each utility file independent — but if a
// third file needed it, that would be the signal to move it into a
// shared parsing helper instead.
function parseAmount(amountString) {
  return Number(amountString.replace(/,/g, ''))
}

// Sums every expense transaction matching a given category. Expenses
// only (isPositive === false) — income transactions like "Salary"
// should never count against a spending budget.
export function calculateSpentForCategory(transactions, category) {
  return transactions
    .filter((transaction) => !transaction.isPositive && transaction.category === category)
    .reduce((sum, transaction) => sum + parseAmount(transaction.amount), 0)
}

export function calculateRemainingBudget(spent, limit) {
  return limit - spent
}

// Division-by-zero guard: a category with a $0 limit would otherwise
// produce Infinity or NaN when calculating a percentage.
export function calculatePercentageUsed(spent, limit) {
  if (limit === 0) return 0
  return (spent / limit) * 100
}

// Business rule for status, kept in one place so Dashboard, Budgets,
// and any future Analytics view all agree on what counts as "Near
// Limit" vs "Over Budget" — rather than each screen inventing its own
// thresholds.
export function determineBudgetStatus(percentage) {
  if (percentage > 100) return 'Over Budget'
  if (percentage >= 80) return 'Near Limit'
  return 'On Track'
}

// Aggregates across ALL categories at once — used for the three
// overview cards (Total Budget, Total Spent, Remaining). Takes an
// array of { limit, spent } pairs rather than raw transactions, so it
// doesn't need to know how spent/limit were derived.
export function calculateTotalBudget(categories) {
  return categories.reduce((sum, category) => sum + category.limit, 0)
}

export function calculateTotalSpent(categories) {
  return categories.reduce((sum, category) => sum + category.spent, 0)
}