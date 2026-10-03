// import { useState } from 'react'
// import { Link } from 'react-router-dom'
// import {
//   Wallet,
//   TrendingUp,
//   TrendingDown,
//   Percent,
//   Plus,
//   AlertCircle,
// } from 'lucide-react'
// import Card from '../components/ui/Card'
// import PageHeader from '../components/ui/PageHeader'
// import SummaryCard from '../components/ui/SummaryCard'
// import EmptyState from '../components/ui/EmptyState'
// import BudgetProgressItem from '../components/dashboard/BudgetProgressItem'
// import SpendingSummary from '../components/dashboard/SpendingSummary'
// import TransactionItem from '../components/transactions/TransactionItem'
// import AddTransactionModal from '../components/transactions/AddTransactionModal'
// import { useTransactions } from '../context/TransactionContext'
// // NEW IMPORT — this is the first part of the change.
// import { useBudgets } from '../context/BudgetContext'
// import { budgetConfig } from '../config/budgetConfig'
// import {
//   calculateTotalIncome,
//   calculateTotalExpenses,
//   calculateBalance,
//   calculateSavingsRate,
// } from '../utils/financialCalculations'
// import {
//   calculateSpentForCategory,
//   calculateRemainingBudget,
//   calculatePercentageUsed,
//   determineBudgetStatus,
// } from '../utils/budgetCalculations'
// import { calculateCategoryBreakdown } from '../utils/analyticsCalculations'

// function formatCurrency(amount) {
//   return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
// }

// function getGreeting() {
//   const hour = new Date().getHours()
//   if (hour < 12) return 'Good Morning'
//   if (hour < 18) return 'Good Afternoon'
//   return 'Good Evening'
// }

// // SAME icon-lookup helper used in Budgets.jsx — budgetConfig no longer
// // supplies limits, only the icon/color pairing per category, since
// // Budget documents from the backend carry no icon data of their own.
// const iconByCategory = Object.fromEntries(
//   budgetConfig.map((config) => [config.category, config])
// )

// function Dashboard() {
//   const [isModalOpen, setIsModalOpen] = useState(false)

//   const { transactions, addTransaction, isLoading, error, refetch } = useTransactions()
//   // NEW — pulling real, per-user budgets from BudgetContext instead of
//   // the old static budgetConfig array.
//   const { budgets, isLoading: isBudgetsLoading } = useBudgets()

//   const totalIncome = calculateTotalIncome(transactions)
//   const totalExpenses = calculateTotalExpenses(transactions)
//   const balance = calculateBalance(totalIncome, totalExpenses)
//   const savingsRate = calculateSavingsRate(totalIncome, totalExpenses)

//   // CHANGED — this used to be:
//   //   const budgetOverview = budgetConfig.map((config) => { ... })
//   // It now maps over the real `budgets` array (from MongoDB via
//   // BudgetContext) instead of the hardcoded config array. The icon
//   // still comes from budgetConfig, via iconByCategory, since that's
//   // now purely a category → icon lookup, not a source of limits.
//   const budgetOverview = budgets.map((budget) => {
//     const spent = calculateSpentForCategory(transactions, budget.category)
//     const remaining = calculateRemainingBudget(spent, budget.limit)
//     const percentage = calculatePercentageUsed(spent, budget.limit)
//     const status = determineBudgetStatus(percentage)
//     const icon = iconByCategory[budget.category] || {}

//     return {
//       category: budget.category,
//       limit: budget.limit,
//       icon: icon.icon,
//       iconBg: icon.iconBg,
//       iconColor: icon.iconColor,
//       spent,
//       remaining,
//       percentage: Math.min(Math.round(percentage), 100),
//       status,
//     }
//   })

//   const topCategories = calculateCategoryBreakdown(transactions).slice(0, 4)

//   const summaryData = [
//     {
//       title: 'Current Balance',
//       value: formatCurrency(balance),
//       description: 'Across all accounts',
//       icon: Wallet,
//       iconBg: 'bg-emerald-50',
//       iconColor: 'text-emerald-600',
//     },
//     {
//       title: 'Monthly Income',
//       value: formatCurrency(totalIncome),
//       description: 'This month, before tax',
//       icon: TrendingUp,
//       iconBg: 'bg-blue-50',
//       iconColor: 'text-blue-600',
//     },
//     {
//       title: 'Monthly Expenses',
//       value: formatCurrency(totalExpenses),
//       description:
//         totalIncome > 0
//           ? `${Math.round((totalExpenses / totalIncome) * 100)}% of income`
//           : 'No income recorded',
//       icon: TrendingDown,
//       iconBg: 'bg-rose-50',
//       iconColor: 'text-rose-500',
//     },
//     {
//       title: 'Savings Rate',
//       value: `${Math.round(savingsRate)}%`,
//       description: 'Share of income you kept',
//       icon: Percent,
//       iconBg: 'bg-amber-50',
//       iconColor: 'text-amber-600',
//     },
//   ]

//   const recentTransactions = transactions.slice(0, 4)

//   if (isLoading) {
//     return (
//       <div className="space-y-8">
//         <PageHeader
//           eyebrow={getGreeting()}
//           title="Dashboard"
//           description="Here's what's happening with your money today."
//           actionLabel="Add Transaction"
//           actionIcon={Plus}
//           onAction={() => setIsModalOpen(true)}
//         />
//         <p className="text-sm text-slate-400">Loading your dashboard...</p>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="space-y-8">
//         <PageHeader
//           eyebrow={getGreeting()}
//           title="Dashboard"
//           description="Here's what's happening with your money today."
//           actionLabel="Add Transaction"
//           actionIcon={Plus}
//           onAction={() => setIsModalOpen(true)}
//         />
//         <Card className="p-6">
//           <EmptyState
//             icon={AlertCircle}
//             title="Couldn't load your dashboard"
//             description={error}
//             buttonLabel="Retry"
//             onButtonClick={refetch}
//           />
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-8">
//       <PageHeader
//         eyebrow={getGreeting()}
//         title="Dashboard"
//         description="Here's what's happening with your money today."
//         actionLabel="Add Transaction"
//         actionIcon={Plus}
//         onAction={() => setIsModalOpen(true)}
//       />

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         {summaryData.map((item) => (
//           <SummaryCard key={item.title} {...item} />
//         ))}
//       </div>

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//         <Card className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-base font-semibold text-slate-900">Budget Overview</h2>
//               <p className="mt-1 text-xs text-slate-400">Your progress against monthly limits</p>
//             </div>
//             <Link to="/budgets" className="text-xs font-medium text-emerald-600 hover:text-emerald-700">
//               View Budgets
//             </Link>
//           </div>

//           {/* NEW — this is the second part of the change. Previously
//               this section just rendered budgetOverview.map(...)
//               unconditionally, because the old static budgetConfig
//               array could never be empty. Now that budgets are real,
//               per-user data, a brand-new user genuinely has zero
//               budgets, so this needs its own small empty state instead
//               of silently rendering an empty grid. */}
//           {isBudgetsLoading ? (
//             <p className="mt-6 text-sm text-slate-400">Loading budgets...</p>
//           ) : budgetOverview.length === 0 ? (
//             <p className="mt-6 text-sm text-slate-400">
//               No budgets yet.{' '}
//               <Link to="/budgets" className="font-medium text-emerald-600 hover:text-emerald-700">
//                 Create one
//               </Link>{' '}
//               to start tracking spending limits.
//             </p>
//           ) : (
//             <div className="mt-6 space-y-5">
//               {budgetOverview.map((item) => (
//                 <BudgetProgressItem key={item.category} {...item} />
//               ))}
//             </div>
//           )}
//         </Card>

//         <Card className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-base font-semibold text-slate-900">Spending by Category</h2>
//               <p className="mt-1 text-xs text-slate-400">Where your money is going</p>
//             </div>
//             <Link to="/analytics" className="text-xs font-medium text-emerald-600 hover:text-emerald-700">
//               View Analytics
//             </Link>
//           </div>
//           <SpendingSummary topCategories={topCategories} />
//         </Card>
//       </div>

//       <Card className="p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-base font-semibold text-slate-900">Recent Transactions</h2>
//             <p className="mt-1 text-xs text-slate-400">Your latest account activity</p>
//           </div>
//           <Link to="/transactions" className="text-xs font-medium text-emerald-600 hover:text-emerald-700">
//             View All
//           </Link>
//         </div>
//         {recentTransactions.length > 0 ? (
//           <ul className="mt-4 divide-y divide-gray-100">
//             {recentTransactions.map((transaction) => (
//               <TransactionItem key={transaction.id} {...transaction} />
//             ))}
//           </ul>
//         ) : (
//           <p className="mt-6 text-sm text-slate-400">No transactions yet — add your first one above.</p>
//         )}
//       </Card>

//       <AddTransactionModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onAddTransaction={addTransaction}
//       />
//     </div>
//   )
// }

// export default Dashboard












import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Percent,
  Plus,
  AlertCircle,
} from 'lucide-react'
import Card from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import SummaryCard from '../components/ui/SummaryCard'
import EmptyState from '../components/ui/EmptyState'
import BudgetProgressItem from '../components/dashboard/BudgetProgressItem'
import SpendingSummary from '../components/dashboard/SpendingSummary'
import TransactionItem from '../components/transactions/TransactionItem'
import AddTransactionModal from '../components/transactions/AddTransactionModal'
import { useTransactions } from '../context/TransactionContext'
import { useBudgets } from '../context/BudgetContext'
import { useCurrencyFormatter } from '../context/SettingsContext'
import { budgetConfig } from '../config/budgetConfig'
import { filterTransactionsByPeriod } from '../utils/analyticsPeriod'
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateBalance,
  calculateSavingsRate,
} from '../utils/financialCalculations'
import {
  calculateSpentForCategory,
  calculateRemainingBudget,
  calculatePercentageUsed,
  determineBudgetStatus,
} from '../utils/budgetCalculations'
import { calculateCategoryBreakdown } from '../utils/analyticsCalculations'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

const iconByCategory = Object.fromEntries(
  budgetConfig.map((config) => [config.category, config])
)

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const formatCurrency = useCurrencyFormatter()

  const { transactions, addTransaction, isLoading, error, refetch } = useTransactions()
  const { budgets, isLoading: isBudgetsLoading } = useBudgets()

  const totalIncome = calculateTotalIncome(transactions)
  const totalExpenses = calculateTotalExpenses(transactions)
  const balance = calculateBalance(totalIncome, totalExpenses)
  const savingsRate = calculateSavingsRate(totalIncome, totalExpenses)

  // V6.14.6 — same reasoning as Budgets.jsx: budgets are monthly
  // limits, so the Dashboard's Budget Overview widget must scope
  // "spent" to the current month rather than the user's entire
  // transaction history, and must use the identical calculation path
  // Budgets.jsx uses so the two pages never disagree with each other.
  const thisMonthTransactions = filterTransactionsByPeriod(transactions, 'thisMonth')

  const budgetOverview = budgets.map((budget) => {
    const spent = calculateSpentForCategory(thisMonthTransactions, budget.category)
    const remaining = calculateRemainingBudget(spent, budget.limit)
    const percentage = calculatePercentageUsed(spent, budget.limit)
    const status = determineBudgetStatus(percentage)
    const icon = iconByCategory[budget.category] || {}

    return {
      category: budget.category,
      limit: budget.limit,
      icon: icon.icon,
      iconBg: icon.iconBg,
      iconColor: icon.iconColor,
      spent,
      remaining,
      percentage: Math.min(Math.round(percentage), 100),
      status,
    }
  })

  const topCategories = calculateCategoryBreakdown(transactions).slice(0, 4)

  const summaryData = [
    {
      title: 'Current Balance',
      value: formatCurrency(balance),
      description: 'Across all accounts',
      icon: Wallet,
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Monthly Income',
      value: formatCurrency(totalIncome),
      description: 'This month, before tax',
      icon: TrendingUp,
      iconBg: 'bg-blue-50 dark:bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(totalExpenses),
      description:
        totalIncome > 0
          ? `${Math.round((totalExpenses / totalIncome) * 100)}% of income`
          : 'No income recorded',
      icon: TrendingDown,
      iconBg: 'bg-rose-50 dark:bg-rose-500/10',
      iconColor: 'text-rose-500 dark:text-rose-400',
    },
    {
      title: 'Savings Rate',
      value: `${Math.round(savingsRate)}%`,
      description: 'Share of income you kept',
      icon: Percent,
      iconBg: 'bg-amber-50 dark:bg-amber-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
  ]

  // V6.14.6 — previously took the first 4 items of `transactions` as-is,
  // which reflects fetch/creation order, not the transaction's actual
  // date. A backdated entry created most recently would incorrectly
  // appear at the top. Sorting by rawDate descending (same convention
  // Transactions.jsx already uses for its own "Newest First" option)
  // fixes this. A shallow copy ([...transactions]) is sorted rather
  // than transactions itself, so the shared context array is never
  // mutated in place.
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate))
    .slice(0, 4)

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow={getGreeting()}
          title="Dashboard"
          description="Here's what's happening with your money today."
          actionLabel="Add Transaction"
          actionIcon={Plus}
          onAction={() => setIsModalOpen(true)}
        />
        <p className="text-sm text-text-muted">Loading your dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow={getGreeting()}
          title="Dashboard"
          description="Here's what's happening with your money today."
          actionLabel="Add Transaction"
          actionIcon={Plus}
          onAction={() => setIsModalOpen(true)}
        />
        <Card className="p-6">
          <EmptyState
            icon={AlertCircle}
            title="Couldn't load your dashboard"
            description={error}
            buttonLabel="Retry"
            onButtonClick={refetch}
          />
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={getGreeting()}
        title="Dashboard"
        description="Here's what's happening with your money today."
        actionLabel="Add Transaction"
        actionIcon={Plus}
        onAction={() => setIsModalOpen(true)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((item) => (
          <SummaryCard key={item.title} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-text-primary">Budget Overview</h2>
              <p className="mt-1 text-xs text-text-muted">Your progress against monthly limits</p>
            </div>
            <Link to="/budgets" className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
              View Budgets
            </Link>
          </div>

          {isBudgetsLoading ? (
            <p className="mt-6 text-sm text-text-muted">Loading budgets...</p>
          ) : budgetOverview.length === 0 ? (
            <p className="mt-6 text-sm text-text-muted">
              No budgets yet.{' '}
              <Link to="/budgets" className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                Create one
              </Link>{' '}
              to start tracking spending limits.
            </p>
          ) : (
            <div className="mt-6 space-y-5">
              {budgetOverview.map((item) => (
                <BudgetProgressItem key={item.category} {...item} />
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-text-primary">Spending by Category</h2>
              <p className="mt-1 text-xs text-text-muted">Where your money is going</p>
            </div>
            <Link to="/analytics" className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
              View Analytics
            </Link>
          </div>
          <SpendingSummary topCategories={topCategories} />
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-text-primary">Recent Transactions</h2>
            <p className="mt-1 text-xs text-text-muted">Your latest account activity</p>
          </div>
          <Link to="/transactions" className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
            View All
          </Link>
        </div>
        {recentTransactions.length > 0 ? (
          <ul className="mt-4 divide-y divide-border">
            {recentTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} {...transaction} />
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-sm text-text-muted">No transactions yet — add your first one above.</p>
        )}
      </Card>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTransaction={addTransaction}
      />
    </div>
  )
}

export default Dashboard