// import { useState } from 'react'
// import { Plus, PackageOpen, SearchX } from 'lucide-react'
// import PageHeader from '../components/ui/PageHeader'
// import Card from '../components/ui/Card'
// import EmptyState from '../components/ui/EmptyState'
// import TransactionItem from '../components/transactions/TransactionItem'
// import TransactionToolbar from '../components/transactions/TransactionToolbar'
// import AddTransactionModal from '../components/transactions/AddTransactionModal'
// import { useTransactions } from '../context/TransactionContext'

// // rawDate is always an unambiguous "YYYY-MM-DD" string (see
// // TransactionContext's mapBackendTransaction), so this no longer needs
// // the fallback year-guessing that the old display-string date required.
// function parseTransactionDate(rawDateString) {
//   return new Date(rawDateString)
// }

// function parseAmount(amountString) {
//   return Number(amountString.replace(/,/g, ''))
// }

// function Transactions() {
//   const [activeFilter, setActiveFilter] = useState('All')
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [searchQuery, setSearchQuery] = useState('')
//   const [editingTransaction, setEditingTransaction] = useState(null)
//   const [sortBy, setSortBy] = useState('newest')

//   const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions()

//   const searchedTransactions = transactions.filter((transaction) =>
//     transaction.title.toLowerCase().includes(searchQuery.toLowerCase())
//   )

//   const filteredTransactions = searchedTransactions.filter((transaction) => {
//     if (activeFilter === 'Income') return transaction.isPositive === true
//     if (activeFilter === 'Expenses') return transaction.isPositive === false
//     return true
//   })

//   const sortedTransactions = [...filteredTransactions].sort((a, b) => {
//     switch (sortBy) {
//       case 'newest':
//         return parseTransactionDate(b.rawDate) - parseTransactionDate(a.rawDate)
//       case 'oldest':
//         return parseTransactionDate(a.rawDate) - parseTransactionDate(b.rawDate)
//       case 'highest':
//         return parseAmount(b.amount) - parseAmount(a.amount)
//       case 'lowest':
//         return parseAmount(a.amount) - parseAmount(b.amount)
//       case 'az':
//         return a.title.localeCompare(b.title)
//       case 'za':
//         return b.title.localeCompare(a.title)
//       default:
//         return 0
//     }
//   })

//   // Two independent questions, checked separately:
//   // "does the app have ANY data at all" vs. "did search/filter/sort
//   // narrow the CURRENT view down to nothing." These read from different
//   // arrays on purpose — transactions.length checks the raw Context data,
//   // sortedTransactions.length checks the fully derived, narrowed result.
//   const hasNoTransactionsAtAll = transactions.length === 0
//   const hasNoMatchingResults = !hasNoTransactionsAtAll && sortedTransactions.length === 0

//   function handleEditClick(transaction) {
//     setEditingTransaction(transaction)
//     setIsModalOpen(true)
//   }

//   function handleAddClick() {
//     setEditingTransaction(null)
//     setIsModalOpen(true)
//   }

//   function handleModalClose() {
//     setIsModalOpen(false)
//     setEditingTransaction(null)
//   }

//   async function handleDeleteClick(id) {
//     const confirmed = window.confirm('Are you sure you want to delete this transaction?')
//     if (confirmed) {
//       // deleteTransaction() now performs a real backend request and
//       // can fail — the confirm dialog only asks intent, it doesn't
//       // guarantee the deletion will succeed.
//       try {
//         await deleteTransaction(id)
//       } catch (error) {
//         window.alert(`Failed to delete transaction: ${error.message}`)
//       }
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Transactions"
//         description="A complete history of your income and expenses."
//         actionLabel="Add Transaction"
//         actionIcon={Plus}
//         onAction={handleAddClick}
//       />

//       <TransactionToolbar
//         searchQuery={searchQuery}
//         onSearchChange={setSearchQuery}
//         activeFilter={activeFilter}
//         onFilterChange={setActiveFilter}
//         sortBy={sortBy}
//         onSortChange={setSortBy}
//       />

//       <Card className="p-6">
//         {hasNoTransactionsAtAll ? (
//           // State A — the app truly has no data yet.
//           <EmptyState
//             icon={PackageOpen}
//             title="No transactions yet"
//             description="Start tracking your finances by adding your first transaction."
//             buttonLabel="Add Your First Transaction"
//             onButtonClick={handleAddClick}
//           />
//         ) : hasNoMatchingResults ? (
//           // State B — data exists, but the current search/filter/sort
//           // combination doesn't match any of it. No button here, since
//           // the fix is adjusting the toolbar above, not adding data.
//           <EmptyState
//             icon={SearchX}
//             title="No matching transactions"
//             description="Try changing your search or filters."
//           />
//         ) : (
//           // State C — normal list, exactly as before.
//           <ul className="divide-y divide-gray-100">
//             {sortedTransactions.map((transaction) => (
//               <TransactionItem
//                 key={transaction.id}
//                 {...transaction}
//                 onEdit={() => handleEditClick(transaction)}
//                 onDelete={() => handleDeleteClick(transaction.id)}
//               />
//             ))}
//           </ul>
//         )}
//       </Card>

//       <AddTransactionModal
//         isOpen={isModalOpen}
//         onClose={handleModalClose}
//         onAddTransaction={addTransaction}
//         onUpdateTransaction={updateTransaction}
//         transaction={editingTransaction}
//       />
//     </div>
//   )
// }

// export default Transactions










import { useState } from 'react'
import { Plus, PackageOpen, SearchX, AlertCircle } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import TransactionItem from '../components/transactions/TransactionItem'
import TransactionToolbar from '../components/transactions/TransactionToolbar'
import AddTransactionModal from '../components/transactions/AddTransactionModal'
import { useTransactions } from '../context/TransactionContext'
import { useCurrencyFormatter } from '../context/SettingsContext'
import { calculateTotalIncome, calculateTotalExpenses } from '../utils/financialCalculations'
import { groupTransactionsByDate } from '../utils/groupTransactionsByDate'

function parseTransactionDate(rawDateString) {
  return new Date(rawDateString)
}

function parseAmount(amountString) {
  return Number(amountString.replace(/,/g, ''))
}

function Transactions() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [sortBy, setSortBy] = useState('newest')
  const [deletingId, setDeletingId] = useState(null)
  const [deleteError, setDeleteError] = useState(null)
  // V6.13 — the transaction a delete confirmation is currently open
  // for. Separate from `deletingId` above, which tracks the request
  // actually IN FLIGHT (used for TransactionItem's dimming effect) —
  // this one just tracks which item ConfirmDialog is showing, before
  // the user has decided anything yet.
  const [pendingDeleteTransaction, setPendingDeleteTransaction] = useState(null)
  const formatCurrency = useCurrencyFormatter()

  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    isLoading,
    error,
    refetch,
  } = useTransactions()

  const searchedTransactions = transactions.filter((transaction) =>
    transaction.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredTransactions = searchedTransactions.filter((transaction) => {
    if (activeFilter === 'Income') return transaction.isPositive === true
    if (activeFilter === 'Expenses') return transaction.isPositive === false
    return true
  })

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return parseTransactionDate(b.rawDate) - parseTransactionDate(a.rawDate)
      case 'oldest':
        return parseTransactionDate(a.rawDate) - parseTransactionDate(b.rawDate)
      case 'highest':
        return parseAmount(b.amount) - parseAmount(a.amount)
      case 'lowest':
        return parseAmount(a.amount) - parseAmount(b.amount)
      case 'az':
        return a.title.localeCompare(b.title)
      case 'za':
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
  })

  const isChronologicalSort = sortBy === 'newest' || sortBy === 'oldest'
  const groupedTransactions = isChronologicalSort ? groupTransactionsByDate(sortedTransactions) : null

  const filteredIncome = calculateTotalIncome(filteredTransactions)
  const filteredExpenses = calculateTotalExpenses(filteredTransactions)

  const hasNoTransactionsAtAll = transactions.length === 0
  const hasNoMatchingResults = !hasNoTransactionsAtAll && sortedTransactions.length === 0

  function handleEditClick(transaction) {
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  function handleAddClick() {
    setEditingTransaction(null)
    setIsModalOpen(true)
  }

  function handleModalClose() {
    setIsModalOpen(false)
    setEditingTransaction(null)
  }

  function handleDeleteClick(transaction) {
    setPendingDeleteTransaction(transaction)
  }

  async function handleConfirmDelete() {
    if (!pendingDeleteTransaction) return

    setDeleteError(null)
    setDeletingId(pendingDeleteTransaction.id)
    try {
      await deleteTransaction(pendingDeleteTransaction.id)
    } catch (deleteErr) {
      setDeleteError(deleteErr.message)
    } finally {
      setDeletingId(null)
      // Closes the dialog either way — on success there's nothing
      // left to confirm; on failure, the existing page-level
      // `deleteError` banner (unchanged) is what communicates the
      // failure, matching exactly how this behaved when window.confirm()
      // was the trigger and had already closed by the time the request
      // was attempted.
      setPendingDeleteTransaction(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Transactions"
          description="A complete history of your income and expenses."
          actionLabel="Add Transaction"
          actionIcon={Plus}
        />
        <p className="text-sm text-text-muted">Loading your transactions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Transactions"
          description="A complete history of your income and expenses."
          actionLabel="Add Transaction"
          actionIcon={Plus}
        />
        <Card className="p-6">
          <EmptyState
            icon={AlertCircle}
            title="Couldn't load your transactions"
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
        title="Transactions"
        description="A complete history of your income and expenses."
        actionLabel="Add Transaction"
        actionIcon={Plus}
        onAction={handleAddClick}
      />

      {!hasNoTransactionsAtAll && (
        <div className="flex flex-col gap-1 px-1 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-text-muted">
            Showing <span className="font-medium text-text-secondary">{sortedTransactions.length}</span> of{' '}
            <span className="font-medium text-text-secondary">{transactions.length}</span> transactions
          </p>
          <p className="text-text-muted">
            Income <span className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(filteredIncome)}</span>
            {' · '}
            Expenses <span className="font-medium text-rose-600 dark:text-rose-400">{formatCurrency(filteredExpenses)}</span>
          </p>
        </div>
      )}

      <TransactionToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {deleteError && (
        <div role="alert" aria-live="polite" className="rounded-lg bg-rose-50 dark:bg-rose-500/10 p-3">
          <p className="text-sm font-medium text-rose-700 dark:text-rose-400">Failed to delete transaction: {deleteError}</p>
        </div>
      )}

      <Card className="p-6">
        {hasNoTransactionsAtAll ? (
          <EmptyState
            icon={PackageOpen}
            title="No transactions yet"
            description="Add your first transaction to start tracking your finances — it will immediately show up here and across your Dashboard, Budgets, and Analytics."
            buttonLabel="Add Your First Transaction"
            onButtonClick={handleAddClick}
          />
        ) : hasNoMatchingResults ? (
          <EmptyState
            icon={SearchX}
            title="No matching transactions"
            description="Try changing your search or filters."
          />
        ) : groupedTransactions ? (
          <div>
            {groupedTransactions.map((group, index) => (
              <div key={group.label} className={index > 0 ? 'mt-6' : ''}>
                <h3 className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  {group.label}
                </h3>
                <ul className="divide-y divide-border">
                  {group.transactions.map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      {...transaction}
                      isDeleting={deletingId === transaction.id}
                      onEdit={() => handleEditClick(transaction)}
                      onDelete={() => handleDeleteClick(transaction)}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {sortedTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                {...transaction}
                isDeleting={deletingId === transaction.id}
                onEdit={() => handleEditClick(transaction)}
                onDelete={() => handleDeleteClick(transaction)}
              />
            ))}
          </ul>
        )}
      </Card>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onAddTransaction={addTransaction}
        onUpdateTransaction={updateTransaction}
        transaction={editingTransaction}
      />

      <ConfirmDialog
        isOpen={pendingDeleteTransaction !== null}
        onClose={() => setPendingDeleteTransaction(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        message={
          pendingDeleteTransaction
            ? `Delete "${pendingDeleteTransaction.title}" (${pendingDeleteTransaction.isPositive ? '+' : '-'}${formatCurrency(Number(pendingDeleteTransaction.amount))})? This can't be undone.`
            : ''
        }
        confirmLabel="Delete"
      />
    </div>
  )
}

export default Transactions