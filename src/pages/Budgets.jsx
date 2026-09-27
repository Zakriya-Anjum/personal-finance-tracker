import { useState } from 'react'
import { Plus, ShoppingBag, Zap, HeartPulse, Lightbulb, AlertCircle, PiggyBank } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import SummaryCard from '../components/ui/SummaryCard'
import BudgetCategoryCard from '../components/budgets/BudgetCategoryCard'
import AddBudgetModal from '../components/budgets/AddBudgetModal'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { useTransactions } from '../context/TransactionContext'
import { useBudgets } from '../context/BudgetContext'
import { useCurrencyFormatter } from '../context/SettingsContext'
import { budgetConfig } from '../config/budgetConfig'
import { filterTransactionsByPeriod } from '../utils/analyticsPeriod'
import {
  calculateSpentForCategory,
  calculateRemainingBudget,
  calculatePercentageUsed,
  determineBudgetStatus,
  calculateTotalBudget,
  calculateTotalSpent,
} from '../utils/budgetCalculations'

const iconByCategory = Object.fromEntries(
  budgetConfig.map((config) => [config.category, config])
)

function buildBudgetInsight(budgetCategories) {
  const categoriesNeedingAttention = budgetCategories.filter((c) => c.status !== 'On Track')

  if (categoriesNeedingAttention.length === 0) {
    return "You're on track in every category this month. Keep it up."
  }
  if (categoriesNeedingAttention.length === 1) {
    const [category] = categoriesNeedingAttention
    const verb = category.status === 'Over Budget' ? 'gone over its budget' : 'nearing its budget limit'
    return `${category.category} has ${verb} this month. Reviewing it first is a good place to start.`
  }
  if (categoriesNeedingAttention.length === 2) {
    const [first, second] = categoriesNeedingAttention
    return `${first.category} and ${second.category} need your attention this month — reviewing these two first is usually the fastest way to bring your overall spending back on track.`
  }
  return `${categoriesNeedingAttention.length} categories need your attention this month — check the cards below to see which ones.`
}

function Budgets() {
  const { transactions } = useTransactions()
  const formatCurrency = useCurrencyFormatter()
  const {
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    isLoading,
    error,
    refetch,
  } = useBudgets()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [deleteError, setDeleteError] = useState(null)
  const [pendingDeleteBudget, setPendingDeleteBudget] = useState(null)

  // V6.14.6 — budgets are explicitly MONTHLY limits (see
  // BudgetCategoryCard's "monthly budget" label), so "spent" must be
  // scoped to the current calendar month rather than summed across a
  // user's entire transaction history. filterTransactionsByPeriod
  // already exists and is used the same way by Analytics' own period
  // selector — reused here rather than duplicating month-filtering
  // logic. Its 'thisMonth' case matches on a full "YYYY-MM" prefix
  // (year + month), so it correctly excludes the same month number in
  // a different year, not just a different month.
  const thisMonthTransactions = filterTransactionsByPeriod(transactions, 'thisMonth')

  const budgetCategories = budgets.map((budget) => {
    const spent = calculateSpentForCategory(thisMonthTransactions, budget.category)
    const remaining = calculateRemainingBudget(spent, budget.limit)
    const percentage = calculatePercentageUsed(spent, budget.limit)
    const status = determineBudgetStatus(percentage)
    const icon = iconByCategory[budget.category] || {}

    return {
      id: budget._id,
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

  const totalBudget = calculateTotalBudget(budgetCategories)
  const totalSpent = calculateTotalSpent(budgetCategories)
  const totalRemaining = totalBudget - totalSpent
  const budgetInsight = buildBudgetInsight(budgetCategories)
  const existingCategories = budgets.map((b) => b.category)

  function handleCreateClick() {
    setEditingBudget(null)
    setIsModalOpen(true)
  }

  function handleEditClick(budget) {
    setEditingBudget(budget)
    setIsModalOpen(true)
  }

  function handleModalClose() {
    setIsModalOpen(false)
    setEditingBudget(null)
  }

  function handleDeleteClick(budget) {
    setPendingDeleteBudget(budget)
  }

  async function handleConfirmDelete() {
    if (!pendingDeleteBudget) return

    setDeleteError(null)
    try {
      await deleteBudget(pendingDeleteBudget.id)
    } catch (deleteErr) {
      setDeleteError(deleteErr.message)
    } finally {
      setPendingDeleteBudget(null)
    }
  }

  const overviewData = [
    {
      title: 'Total Budget',
      value: formatCurrency(totalBudget),
      description: 'Combined monthly limit',
      icon: ShoppingBag,
      iconBg: 'bg-blue-50 dark:bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Total Spent',
      value: formatCurrency(totalSpent),
      description: totalBudget > 0 ? `${Math.round((totalSpent / totalBudget) * 100)}% of total budget` : 'No budget set',
      icon: Zap,
      iconBg: 'bg-amber-50 dark:bg-amber-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Remaining',
      value: formatCurrency(totalRemaining),
      description: 'Left for this month',
      icon: HeartPulse,
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Budgets" description="Track your spending against monthly limits by category." actionLabel="Create Budget" actionIcon={Plus} />
        <p className="text-sm text-text-muted">Loading your budgets...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <PageHeader title="Budgets" description="Track your spending against monthly limits by category." actionLabel="Create Budget" actionIcon={Plus} />
        <Card className="p-6">
          <EmptyState icon={AlertCircle} title="Couldn't load your budgets" description={error} buttonLabel="Retry" onButtonClick={refetch} />
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Budgets"
        description="Track your spending against monthly limits by category."
        actionLabel="Create Budget"
        actionIcon={Plus}
        onAction={handleCreateClick}
      />

      {deleteError && (
        <div role="alert" aria-live="polite" className="rounded-lg bg-rose-50 dark:bg-rose-500/10 p-3">
          <p className="text-sm font-medium text-rose-700 dark:text-rose-400">Failed to delete budget: {deleteError}</p>
        </div>
      )}

      {budgets.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={PiggyBank}
            title="No budgets yet"
            description="Create a budget for a category to start tracking your spending against a monthly limit."
            buttonLabel="Create Your First Budget"
            onButtonClick={handleCreateClick}
          />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {overviewData.map((item) => (
              <SummaryCard key={item.title} {...item} />
            ))}
          </div>

          <div>
            <h2 className="text-base font-semibold text-text-primary">Budget Categories</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {budgetCategories.map((item) => (
                <BudgetCategoryCard
                  key={item.id}
                  {...item}
                  onEdit={() => handleEditClick(item)}
                  onDelete={() => handleDeleteClick(item)}
                />
              ))}
            </div>
          </div>

          <Card className="flex items-start gap-4 p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
              <Lightbulb className="h-5 w-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-secondary">Budget Insight</h3>
              <p className="mt-1 text-sm text-text-muted">{budgetInsight}</p>
            </div>
          </Card>
        </>
      )}

      <AddBudgetModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onAddBudget={addBudget}
        onUpdateBudget={updateBudget}
        budget={editingBudget}
        existingCategories={existingCategories}
      />

      <ConfirmDialog
        isOpen={pendingDeleteBudget !== null}
        onClose={() => setPendingDeleteBudget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Budget"
        message={
          pendingDeleteBudget
            ? `Delete your ${pendingDeleteBudget.category} budget? This can't be undone.`
            : ''
        }
        confirmLabel="Delete Budget"
      />
    </div>
  )
}

export default Budgets