// // Pure analytics calculations — same rules as financialCalculations.js
// // and budgetCalculations.js: plain data in, plain values out, no React,
// // no Context, no JSX. This file specifically handles calculations that
// // are unique to Analytics (grouping by category, averages, "highest"
// // lookups) rather than duplicating anything that already exists.

// function parseAmount(amountString) {
//   return Number(amountString.replace(/,/g, ''))
// }

// // Groups all EXPENSE transactions by category and sums each group.
// // This is a "reduce into an object" pattern — instead of collapsing
// // an array into a single number (like calculateTotalIncome does), we
// // collapse it into an object where each key is a category and each
// // value is that category's running total.
// export function calculateCategoryBreakdown(transactions) {
//   const totals = transactions
//     .filter((transaction) => !transaction.isPositive)
//     .reduce((totalsByCategory, transaction) => {
//       const amount = parseAmount(transaction.amount)
//       const currentTotal = totalsByCategory[transaction.category] || 0
//       return {
//         ...totalsByCategory,
//         [transaction.category]: currentTotal + amount,
//       }
//     }, {})

//   const totalExpenses = Object.values(totals).reduce((sum, amount) => sum + amount, 0)

//   return Object.entries(totals)
//     .map(([category, total]) => ({
//       category,
//       total,
//       percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
//     }))
//     .sort((a, b) => b.total - a.total)
// }

// export function findHighestSpendingCategory(transactions) {
//   const breakdown = calculateCategoryBreakdown(transactions)
//   if (breakdown.length === 0) return null
//   return breakdown[0]
// }

// export function calculateAverageAmount(transactions, isPositive) {
//   const matching = transactions.filter((transaction) => transaction.isPositive === isPositive)
//   if (matching.length === 0) return 0

//   const total = matching.reduce((sum, transaction) => sum + parseAmount(transaction.amount), 0)
//   return total / matching.length
// }

// export function calculateTransactionCount(transactions, isPositive) {
//   return transactions.filter((transaction) => transaction.isPositive === isPositive).length
// }

// // ==================================================
// // V6.10 ADDITIONS BELOW — existing functions above unchanged.
// // ==================================================

// // Groups EXPENSE transactions into a chronological spending trend.
// // Granularity is chosen automatically: if the data spans more than
// // one calendar month, group by month (a trend across months is more
// // useful than dozens of daily bars); if everything falls within a
// // single month (common when the page's period filter is "This Month"
// // or "Last Month"), group by day instead, since a month-granularity
// // trend would otherwise collapse to a single, meaningless bar.
// export function calculateSpendingTrend(transactions) {
//   const expenses = transactions.filter((t) => !t.isPositive)

//   if (expenses.length === 0) {
//     return { granularity: 'none', data: [] }
//   }

//   const distinctMonths = new Set(expenses.map((t) => t.rawDate.slice(0, 7)))
//   const granularity = distinctMonths.size > 1 ? 'month' : 'day'

//   const totalsByKey = expenses.reduce((acc, t) => {
//     const key = granularity === 'month' ? t.rawDate.slice(0, 7) : t.rawDate
//     acc[key] = (acc[key] || 0) + parseAmount(t.amount)
//     return acc
//   }, {})

//   const data = Object.entries(totalsByKey)
//     .sort(([a], [b]) => a.localeCompare(b))
//     .map(([key, total]) => ({
//       key,
//       label:
//         granularity === 'month'
//           ? new Date(`${key}-01`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
//           : new Date(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
//       total,
//     }))

//   return { granularity, data }
// }

// // Combines real Budget documents (BudgetContext) with real transaction
// // spending — the SAME calculateSpentForCategory logic Budgets.jsx
// // already uses, imported rather than reimplemented, so there is only
// // ever one place that defines "how much has been spent in category X."
// export function calculateBudgetVsActual(budgets, transactions, calculateSpentForCategory) {
//   return budgets.map((budget) => ({
//     category: budget.category,
//     limit: budget.limit,
//     spent: calculateSpentForCategory(transactions, budget.category),
//   }))
// }

// // Produces a short, honest, data-derived summary sentence. Every fact
// // it can mention comes from an already-computed value passed in —
// // nothing here is invented, and no category name is ever hardcoded.
// export function generateAnalyticsInsight({
//   totalIncome,
//   totalExpenses,
//   highestCategory,
//   budgetVsActual,
// }) {
//   const facts = []

//   if (totalIncome === 0 && totalExpenses === 0) {
//     return 'No transactions in this period yet — insights will appear once you add some.'
//   }

//   if (totalIncome > 0 && totalExpenses > totalIncome) {
//     facts.push('you spent more than you earned in this period')
//   } else if (totalIncome > 0) {
//     facts.push('your income covered your expenses in this period')
//   }

//   if (highestCategory) {
//     facts.push(`${highestCategory.category} was your largest expense category`)
//   }

//   if (budgetVsActual && budgetVsActual.length > 0) {
//     const overCount = budgetVsActual.filter((b) => b.spent > b.limit).length
//     if (overCount > 0) {
//       facts.push(`${overCount} budget${overCount === 1 ? ' is' : 's are'} currently over its limit`)
//     }
//   }

//   if (facts.length === 0) {
//     return 'Your finances look steady for this period — no notable patterns to flag.'
//   }

//   // Joins whatever real facts were found into one sentence, capitalized.
//   const sentence = facts.join('; ')
//   return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
// }










function parseAmount(amountString) {
  return Number(amountString.replace(/,/g, ''))
}

export function calculateCategoryBreakdown(transactions) {
  const totals = transactions
    .filter((transaction) => !transaction.isPositive)
    .reduce((totalsByCategory, transaction) => {
      const amount = parseAmount(transaction.amount)
      const currentTotal = totalsByCategory[transaction.category] || 0
      return {
        ...totalsByCategory,
        [transaction.category]: currentTotal + amount,
      }
    }, {})

  const totalExpenses = Object.values(totals).reduce((sum, amount) => sum + amount, 0)

  return Object.entries(totals)
    .map(([category, total]) => ({
      category,
      total,
      percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total)
}

export function findHighestSpendingCategory(transactions) {
  const breakdown = calculateCategoryBreakdown(transactions)
  if (breakdown.length === 0) return null
  return breakdown[0]
}

export function calculateAverageAmount(transactions, isPositive) {
  const matching = transactions.filter((transaction) => transaction.isPositive === isPositive)
  if (matching.length === 0) return 0

  const total = matching.reduce((sum, transaction) => sum + parseAmount(transaction.amount), 0)
  return total / matching.length
}

export function calculateTransactionCount(transactions, isPositive) {
  return transactions.filter((transaction) => transaction.isPositive === isPositive).length
}

export function calculateSpendingTrend(transactions) {
  const expenses = transactions.filter((t) => !t.isPositive)

  if (expenses.length === 0) {
    return { granularity: 'none', data: [] }
  }

  const distinctMonths = new Set(expenses.map((t) => t.rawDate.slice(0, 7)))
  const granularity = distinctMonths.size > 1 ? 'month' : 'day'

  const totalsByKey = expenses.reduce((acc, t) => {
    const key = granularity === 'month' ? t.rawDate.slice(0, 7) : t.rawDate
    acc[key] = (acc[key] || 0) + parseAmount(t.amount)
    return acc
  }, {})

  const data = Object.entries(totalsByKey)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, total]) => ({
      key,
      label:
        granularity === 'month'
          ? new Date(`${key}-01`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
          : new Date(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      total,
    }))

  return { granularity, data }
}

export function generateAnalyticsInsight({
  totalIncome,
  totalExpenses,
  highestCategory,
}) {
  const facts = []

  if (totalIncome === 0 && totalExpenses === 0) {
    return 'No transactions in this period yet — insights will appear once you add some.'
  }

  if (totalIncome > 0 && totalExpenses > totalIncome) {
    facts.push('you spent more than you earned in this period')
  } else if (totalIncome > 0) {
    facts.push('your income covered your expenses in this period')
  }

  if (highestCategory) {
    facts.push(`${highestCategory.category} was your largest expense category`)
  }

  if (facts.length === 0) {
    return 'Your finances look steady for this period — no notable patterns to flag.'
  }

  const sentence = facts.join('; ')
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
}