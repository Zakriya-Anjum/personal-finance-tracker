// import { useState } from 'react'
// import { TrendingUp, TrendingDown, Wallet, Percent, Trophy, Receipt, AlertCircle, PieChart, Target } from 'lucide-react'
// import PageHeader from '../components/ui/PageHeader'
// import SummaryCard from '../components/ui/SummaryCard'
// import Card from '../components/ui/Card'
// import EmptyState from '../components/ui/EmptyState'
// import SpendingByCategoryChart from '../components/analytics/SpendingByCategoryChart'
// import IncomeExpenseChart from '../components/analytics/IncomeExpenseChart'
// import SpendingTrendChart from '../components/analytics/SpendingTrendChart'
// import BudgetVsActualChart from '../components/analytics/BudgetVsActualChart'
// import { useTransactions } from '../context/TransactionContext'
// import { useBudgets } from '../context/BudgetContext'
// import {
//   calculateTotalIncome,
//   calculateTotalExpenses,
//   calculateBalance,
//   calculateSavingsRate,
// } from '../utils/financialCalculations'
// import {
//   calculateCategoryBreakdown,
//   findHighestSpendingCategory,
//   calculateAverageAmount,
//   calculateTransactionCount,
//   calculateSpendingTrend,
//   calculateBudgetVsActual,
//   generateAnalyticsInsight,
// } from '../utils/analyticsCalculations'
// import { calculateSpentForCategory } from '../utils/budgetCalculations'
// import { filterTransactionsByPeriod, PERIOD_OPTIONS } from '../utils/analyticsPeriod'

// function formatCurrency(amount) {
//   return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
// }

// function Analytics() {
//   const { transactions, isLoading, error, refetch } = useTransactions()
//   const { budgets, isLoading: isBudgetsLoading } = useBudgets()

//   const [period, setPeriod] = useState('thisMonth')

//   // Every metric/chart below (except Budget vs. Actual, explained at
//   // its own section) is derived from THIS filtered array — one single
//   // filtering step, applied consistently, rather than each section
//   // re-deciding what "the current period" means.
//   const periodTransactions = filterTransactionsByPeriod(transactions, period)

//   const totalIncome = calculateTotalIncome(periodTransactions)
//   const totalExpenses = calculateTotalExpenses(periodTransactions)
//   const netCashFlow = calculateBalance(totalIncome, totalExpenses)
//   const savingsRate = calculateSavingsRate(totalIncome, totalExpenses)

//   const categoryBreakdown = calculateCategoryBreakdown(periodTransactions)
//   const highestCategory = findHighestSpendingCategory(periodTransactions)
//   const averageExpense = calculateAverageAmount(periodTransactions, false)
//   const expenseCount = calculateTransactionCount(periodTransactions, false)

//   const spendingTrend = calculateSpendingTrend(periodTransactions)

//   // Budget vs. Actual deliberately uses ALL transactions filtered to
//   // "thisMonth" specifically, NOT the page's period selector — budget
//   // limits are inherently monthly, so comparing them against, say,
//   // "Last 3 Months" of spending would misrepresent the limit. This is
//   // labeled explicitly in the section below so it's never ambiguous
//   // why this one part of the page doesn't move with the selector.
//   const thisMonthTransactions = filterTransactionsByPeriod(transactions, 'thisMonth')
//   const budgetVsActual = calculateBudgetVsActual(budgets, thisMonthTransactions, calculateSpentForCategory)

//   const insight = generateAnalyticsInsight({ totalIncome, totalExpenses, highestCategory, budgetVsActual })

//   const overviewData = [
//     {
//       title: 'Total Income',
//       value: formatCurrency(totalIncome),
//       description: 'For the selected period',
//       icon: TrendingUp,
//       iconBg: 'bg-blue-50',
//       iconColor: 'text-blue-600',
//     },
//     {
//       title: 'Total Expenses',
//       value: formatCurrency(totalExpenses),
//       description: `${expenseCount} transaction${expenseCount === 1 ? '' : 's'}`,
//       icon: TrendingDown,
//       iconBg: 'bg-rose-50',
//       iconColor: 'text-rose-500',
//     },
//     {
//       title: 'Net Cash Flow',
//       value: formatCurrency(netCashFlow),
//       description: netCashFlow >= 0 ? 'Income minus expenses' : 'Spent more than earned',
//       icon: Wallet,
//       iconBg: netCashFlow >= 0 ? 'bg-emerald-50' : 'bg-rose-50',
//       iconColor: netCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-500',
//     },
//     {
//       title: 'Savings Rate',
//       // Honest fallback — 0% (a real, meaningful number) and "no
//       // income to measure" (a fundamentally different situation) must
//       // never be displayed as the same thing.
//       value: totalIncome > 0 ? `${Math.round(savingsRate)}%` : '—',
//       description: totalIncome > 0 ? 'Of total income saved' : 'No income in this period',
//       icon: Percent,
//       iconBg: 'bg-amber-50',
//       iconColor: 'text-amber-600',
//     },
//   ]

//   if (isLoading) {
//     return (
//       <div className="space-y-8">
//         <PageHeader title="Analytics" description="A deeper look at your spending patterns and trends." />
//         <p className="text-sm text-slate-400">Loading your analytics...</p>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="space-y-8">
//         <PageHeader title="Analytics" description="A deeper look at your spending patterns and trends." />
//         <Card className="p-6">
//           <EmptyState icon={AlertCircle} title="Couldn't load your analytics" description={error} buttonLabel="Retry" onButtonClick={refetch} />
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-8">
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <PageHeader title="Analytics" description="A deeper look at your spending patterns and trends." />
//         {/* Period control — a plain <select>, matching the exact same
//             control convention already used for sorting on the
//             Transactions page, rather than inventing a new UI pattern
//             for this one control. */}
//         <select
//           value={period}
//           onChange={(e) => setPeriod(e.target.value)}
//           aria-label="Analysis period"
//           className="h-fit rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
//         >
//           {PERIOD_OPTIONS.map((option) => (
//             <option key={option.value} value={option.value}>
//               {option.label}
//             </option>
//           ))}
//         </select>
//       </div>

//       {periodTransactions.length === 0 ? (
//         <Card className="p-6">
//           <EmptyState
//             icon={PieChart}
//             title="No activity in this period"
//             description="Try selecting a different period, or add some transactions to see your analytics."
//           />
//         </Card>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//             {overviewData.map((item) => (
//               <SummaryCard key={item.title} {...item} />
//             ))}
//           </div>

//           <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//             <Card className="p-6">
//               <h2 className="text-base font-semibold text-slate-900">Income vs. Expenses</h2>
//               <p className="mt-1 text-xs text-slate-400">How much you earned vs. spent this period</p>
//               <div className="mt-4">
//                 <IncomeExpenseChart totalIncome={totalIncome} totalExpenses={totalExpenses} />
//               </div>
//             </Card>

//             <Card className="p-6">
//               <h2 className="text-base font-semibold text-slate-900">Spending Trend</h2>
//               <p className="mt-1 text-xs text-slate-400">
//                 {spendingTrend.granularity === 'month' ? 'Expenses by month' : 'Expenses by day'}
//               </p>
//               {spendingTrend.data.length < 2 ? (
//                 <p className="mt-6 text-sm text-slate-400">
//                   Not enough data yet for a meaningful trend — add a few more transactions across different dates.
//                 </p>
//               ) : (
//                 <div className="mt-4">
//                   <SpendingTrendChart data={spendingTrend.data} />
//                 </div>
//               )}
//             </Card>
//           </div>

//           <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//             <Card className="p-6 lg:col-span-2">
//               <h2 className="text-base font-semibold text-slate-900">Spending by Category</h2>
//               <p className="mt-1 text-xs text-slate-400">Share of total expenses per category</p>
//               {categoryBreakdown.length > 0 ? (
//                 <div className="mt-6">
//                   <SpendingByCategoryChart categoryBreakdown={categoryBreakdown} />
//                 </div>
//               ) : (
//                 <p className="mt-6 text-sm text-slate-400">No expense data in this period.</p>
//               )}
//             </Card>

//             <Card className="p-6 lg:col-span-1">
//               <h2 className="text-base font-semibold text-slate-900">Highlights</h2>
//               <p className="mt-1 text-xs text-slate-400">Quick facts from this period</p>
//               <div className="mt-6 space-y-5">
//                 <div className="flex items-start gap-3">
//                   <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50">
//                     <Trophy className="h-4.5 w-4.5 text-amber-600" strokeWidth={2} />
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-400">Highest spending category</p>
//                     <p className="text-sm font-medium text-slate-800">
//                       {highestCategory ? `${highestCategory.category} · ${formatCurrency(highestCategory.total)}` : 'No data yet'}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
//                     <Receipt className="h-4.5 w-4.5 text-slate-600" strokeWidth={2} />
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-400">Average expense</p>
//                     <p className="text-sm font-medium text-slate-800">{formatCurrency(averageExpense)}</p>
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         </>
//       )}

//       {/* Budget vs. Actual — always reflects THIS calendar month,
//           independent of the period selector above (see the code
//           comment where thisMonthTransactions is computed for why). */}
//       <Card className="p-6">
//         <div className="flex items-center gap-2">
//           <Target className="h-4 w-4 text-slate-400" strokeWidth={2} />
//           <h2 className="text-base font-semibold text-slate-900">Budget vs. Actual</h2>
//         </div>
//         <p className="mt-1 text-xs text-slate-400">This month's spending against your budget limits</p>

//         {isBudgetsLoading ? (
//           <p className="mt-6 text-sm text-slate-400">Loading budgets...</p>
//         ) : budgetVsActual.length === 0 ? (
//           <p className="mt-6 text-sm text-slate-400">
//             You haven't created any budgets yet — set one up on the Budgets page to compare it here.
//           </p>
//         ) : (
//           <div className="mt-6">
//             <BudgetVsActualChart budgetVsActual={budgetVsActual} />
//           </div>
//         )}
//       </Card>

//       {periodTransactions.length > 0 && (
//         <Card className="flex items-start gap-4 p-6">
//           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
//             <Wallet className="h-5 w-5 text-emerald-600" strokeWidth={2} />
//           </div>
//           <div>
//             <h3 className="text-sm font-semibold text-slate-800">Summary</h3>
//             <p className="mt-1 text-sm text-slate-500">{insight}</p>
//           </div>
//         </Card>
//       )}
//     </div>
//   )
// }

// export default Analytics







import { useState } from 'react'
import { TrendingUp, TrendingDown, Wallet, Percent, Trophy, Receipt, AlertCircle, PieChart } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import SummaryCard from '../components/ui/SummaryCard'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import SpendingByCategoryChart from '../components/analytics/SpendingByCategoryChart'
import IncomeExpenseChart from '../components/analytics/IncomeExpenseChart'
import SpendingTrendChart from '../components/analytics/SpendingTrendChart'
import { useTransactions } from '../context/TransactionContext'
import { useCurrencyFormatter } from '../context/SettingsContext'
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateBalance,
  calculateSavingsRate,
} from '../utils/financialCalculations'
import {
  calculateCategoryBreakdown,
  findHighestSpendingCategory,
  calculateAverageAmount,
  calculateTransactionCount,
  calculateSpendingTrend,
  generateAnalyticsInsight,
} from '../utils/analyticsCalculations'
import { filterTransactionsByPeriod, PERIOD_OPTIONS } from '../utils/analyticsPeriod'

function Analytics() {
  const { transactions, isLoading, error, refetch } = useTransactions()
  const formatCurrency = useCurrencyFormatter()

  const [period, setPeriod] = useState('thisMonth')

  const periodTransactions = filterTransactionsByPeriod(transactions, period)

  const totalIncome = calculateTotalIncome(periodTransactions)
  const totalExpenses = calculateTotalExpenses(periodTransactions)
  const netCashFlow = calculateBalance(totalIncome, totalExpenses)
  const savingsRate = calculateSavingsRate(totalIncome, totalExpenses)

  const categoryBreakdown = calculateCategoryBreakdown(periodTransactions)
  const highestCategory = findHighestSpendingCategory(periodTransactions)
  const averageExpense = calculateAverageAmount(periodTransactions, false)
  const expenseCount = calculateTransactionCount(periodTransactions, false)

  const spendingTrend = calculateSpendingTrend(periodTransactions)

  const insight = generateAnalyticsInsight({ totalIncome, totalExpenses, highestCategory })

  const overviewData = [
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome),
      description: 'For the selected period',
      icon: TrendingUp,
      iconBg: 'bg-blue-50 dark:bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      description: `${expenseCount} transaction${expenseCount === 1 ? '' : 's'}`,
      icon: TrendingDown,
      iconBg: 'bg-rose-50 dark:bg-rose-500/10',
      iconColor: 'text-rose-500 dark:text-rose-400',
    },
    {
      title: 'Net Cash Flow',
      value: formatCurrency(netCashFlow),
      description: netCashFlow >= 0 ? 'Income minus expenses' : 'Spent more than earned',
      icon: Wallet,
      iconBg: netCashFlow >= 0 ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-rose-50 dark:bg-rose-500/10',
      iconColor: netCashFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400',
    },
    {
      title: 'Savings Rate',
      value: totalIncome > 0 ? `${Math.round(savingsRate)}%` : '—',
      description: totalIncome > 0 ? 'Of total income saved' : 'No income in this period',
      icon: Percent,
      iconBg: 'bg-amber-50 dark:bg-amber-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Analytics" description="A deeper look at your spending patterns and trends." />
        <p className="text-sm text-text-muted">Loading your analytics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <PageHeader title="Analytics" description="A deeper look at your spending patterns and trends." />
        <Card className="p-6">
          <EmptyState icon={AlertCircle} title="Couldn't load your analytics" description={error} buttonLabel="Retry" onButtonClick={refetch} />
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Analytics" description="A deeper look at your spending patterns and trends." />
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          aria-label="Analysis period"
          className="h-fit rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-text-secondary focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-500/30"
        >
          {PERIOD_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {periodTransactions.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={PieChart}
            title="No activity in this period"
            description="Try selecting a different period, or add some transactions to see your analytics."
          />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {overviewData.map((item) => (
              <SummaryCard key={item.title} {...item} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h2 className="text-base font-semibold text-text-primary">Income vs. Expenses</h2>
              <p className="mt-1 text-xs text-text-muted">How much you earned vs. spent this period</p>
              <div className="mt-4">
                <IncomeExpenseChart totalIncome={totalIncome} totalExpenses={totalExpenses} />
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-base font-semibold text-text-primary">Spending Trend</h2>
              <p className="mt-1 text-xs text-text-muted">
                {spendingTrend.granularity === 'month' ? 'Expenses by month' : 'Expenses by day'}
              </p>
              {spendingTrend.data.length < 2 ? (
                <p className="mt-6 text-sm text-text-muted">
                  Not enough data yet for a meaningful trend — add a few more transactions across different dates.
                </p>
              ) : (
                <div className="mt-4">
                  <SpendingTrendChart data={spendingTrend.data} />
                </div>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="p-6 lg:col-span-2">
              <h2 className="text-base font-semibold text-text-primary">Spending by Category</h2>
              <p className="mt-1 text-xs text-text-muted">Share of total expenses per category</p>
              {categoryBreakdown.length > 0 ? (
                <div className="mt-6">
                  <SpendingByCategoryChart categoryBreakdown={categoryBreakdown} />
                </div>
              ) : (
                <p className="mt-6 text-sm text-text-muted">No expense data in this period.</p>
              )}
            </Card>

            <Card className="p-6 lg:col-span-1">
              <h2 className="text-base font-semibold text-text-primary">Highlights</h2>
              <p className="mt-1 text-xs text-text-muted">Quick facts from this period</p>
              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10">
                    <Trophy className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Highest spending category</p>
                    <p className="text-sm font-medium text-text-secondary">
                      {highestCategory ? `${highestCategory.category} · ${formatCurrency(highestCategory.total)}` : 'No data yet'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
                    <Receipt className="h-4.5 w-4.5 text-text-secondary" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Average expense</p>
                    <p className="text-sm font-medium text-text-secondary">{formatCurrency(averageExpense)}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {periodTransactions.length > 0 && (
        <Card className="flex items-start gap-4 p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
            <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-secondary">Summary</h3>
            <p className="mt-1 text-sm text-text-muted">{insight}</p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Analytics