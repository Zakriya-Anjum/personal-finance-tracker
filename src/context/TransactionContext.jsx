// import { createContext, useContext, useState, useEffect } from 'react'
// import { Receipt } from 'lucide-react'
// import { useAuth } from './AuthContext'
// import {
//   getTransactions,
//   createTransaction,
//   updateTransaction as updateTransactionApi,
//   deleteTransaction as deleteTransactionApi,
// } from '../api/transactionApi'

// // The single source of truth for transaction data now lives in
// // MongoDB, reached through the backend API. TransactionContext's job
// // is no longer to OWN the data (that's the database's job) — it's to
// // fetch it, hold a local copy in React state for the UI to render,
// // and keep that copy in sync with the backend after every change.
// const TransactionContext = createContext(undefined)

// // The backend Transaction document has no concept of an icon — that's
// // purely a frontend presentation detail. Every transaction loaded from
// // (or created through) the backend gets this same generic icon, which
// // mirrors what AddTransactionModal already does for brand-new
// // transactions today. This keeps TransactionItem completely unchanged:
// // it still receives an `icon` component, `iconBg`, and `iconColor`,
// // exactly as before.
// const DEFAULT_ICON = {
//   icon: Receipt,
//   iconName: 'Receipt',
//   iconBg: 'bg-slate-100',
//   iconColor: 'text-slate-600',
// }

// // Converts a backend Transaction document into the shape the existing
// // UI already expects. Two date-related fields are produced from the
// // single backend `date`:
// //
// //   - `date`    → a short display string ("Jul 28"), used by
// //                 TransactionItem exactly like before.
// //   - `rawDate` → an unambiguous "YYYY-MM-DD" string, used for
// //                 sorting (Transactions.jsx) and as the value prefilled
// //                 into the <input type="date"> when editing
// //                 (AddTransactionModal.jsx).
// //
// // Both are derived using the UTC calendar date encoded in the ISO
// // string, NOT the browser's local timezone. If we used the browser's
// // local time zone instead, a date stored as midnight UTC could
// // display as the previous day for anyone west of UTC — the date the
// // user picked would silently shift.
// function mapBackendTransaction(backendTransaction) {
//   const isoDate = backendTransaction.date

//   // Slicing the first 10 characters of an ISO string ("2026-07-28")
//   // sidesteps timezone conversion entirely — we're reading the
//   // calendar date exactly as MongoDB stored it, not reinterpreting it
//   // through the browser's local clock.
//   const rawDate = isoDate.slice(0, 10)

//   const displayDate = new Date(isoDate).toLocaleDateString('en-US', {
//     month: 'short',
//     day: 'numeric',
//     // Forces the formatter to read the UTC calendar date rather than
//     // converting to the browser's local timezone first — same reason
//     // as the rawDate slice above.
//     timeZone: 'UTC',
//   })

//   return {
//     id: backendTransaction._id,
//     ...DEFAULT_ICON,
//     title: backendTransaction.title,
//     category: backendTransaction.category,
//     date: displayDate,
//     rawDate,
//     // The backend stores amount as a Number; the existing UI expects
//     // a fixed-2-decimal string ("84.32"), same as it always has.
//     amount: Number(backendTransaction.amount).toFixed(2),
//     isPositive: backendTransaction.type === 'income',
//   }
// }

// // Converts a frontend transaction object (as built by
// // AddTransactionModal, still in the existing display shape) into the
// // plain data shape the backend Schema expects. This is the reverse of
// // mapBackendTransaction, and keeps that translation in exactly one
// // place rather than scattered across every call site.
// function buildBackendPayload(transaction) {
//   return {
//     title: transaction.title,
//     amount: Number(transaction.amount),
//     type: transaction.isPositive ? 'income' : 'expense',
//     category: transaction.category,
//     // AddTransactionModal's date input already produces a
//     // "YYYY-MM-DD" string, which is exactly what Mongoose needs to
//     // construct a valid Date — no further conversion required.
//     date: transaction.date,
//   }
// }

// export function TransactionProvider({ children }) {
//   const { token, isAuthenticated } = useAuth()

//   const [transactions, setTransactions] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)

//   // Transaction data is user-specific, so it must react to
//   // authentication changes:
//   //   - logged in  → fetch that user's transactions from the backend
//   //   - logged out → clear transactions immediately, so a second
//   //                   person using the same browser never sees the
//   //                   previous user's data, even for a moment.
//   useEffect(() => {
//     if (!isAuthenticated || !token) {
//       setTransactions([])
//       setIsLoading(false)
//       setError(null)
//       return
//     }

//     // Guards against a race condition: if the user logs out (or
//     // switches accounts) WHILE a fetch is still in flight, this
//     // prevents that now-stale response from overwriting state after
//     // the effect has already moved on.
//     let isCancelled = false

//     async function loadTransactions() {
//       setIsLoading(true)
//       setError(null)

//       try {
//         const backendTransactions = await getTransactions(token)
//         if (!isCancelled) {
//           setTransactions(backendTransactions.map(mapBackendTransaction))
//         }
//       } catch (fetchError) {
//         // If the initial load fails, we deliberately do NOT leave
//         // stale/previous transactions in state, but we also don't
//         // treat this the same as "the user genuinely has zero
//         // transactions" — the error is preserved here so a future UI
//         // layer can distinguish "empty" from "failed to load".
//         if (!isCancelled) {
//           setTransactions([])
//           setError(fetchError.message)
//         }
//       } finally {
//         if (!isCancelled) {
//           setIsLoading(false)
//         }
//       }
//     }

//     loadTransactions()

//     return () => {
//       isCancelled = true
//     }
//   }, [isAuthenticated, token])

//   // React state is updated ONLY after the backend confirms success.
//   // If createTransaction() throws, this function throws too — it does
//   // not catch the error itself. This lets the caller (currently
//   // AddTransactionModal) know the operation failed and react
//   // accordingly, instead of the UI silently assuming success.
//   async function addTransaction(newTransactionData) {
//     const payload = buildBackendPayload(newTransactionData)
//     const createdTransaction = await createTransaction(payload, token)
//     const mappedTransaction = mapBackendTransaction(createdTransaction)
//     setTransactions((prev) => [mappedTransaction, ...prev])
//     return mappedTransaction
//   }

//   async function updateTransaction(updatedTransactionData) {
//     const payload = buildBackendPayload(updatedTransactionData)
//     const updatedFromBackend = await updateTransactionApi(
//       updatedTransactionData.id,
//       payload,
//       token
//     )
//     const mappedTransaction = mapBackendTransaction(updatedFromBackend)
//     setTransactions((prev) =>
//       prev.map((transaction) =>
//         transaction.id === mappedTransaction.id ? mappedTransaction : transaction
//       )
//     )
//     return mappedTransaction
//   }

//   async function deleteTransaction(id) {
//     await deleteTransactionApi(id, token)
//     setTransactions((prev) => prev.filter((transaction) => transaction.id !== id))
//   }

//   return (
//     <TransactionContext.Provider
//       value={{
//         transactions,
//         addTransaction,
//         updateTransaction,
//         deleteTransaction,
//         isLoading,
//         error,
//       }}
//     >
//       {children}
//     </TransactionContext.Provider>
//   )
// }

// // Custom hook wrapping useContext — this is what lets components write
// // `useTransactions()` instead of `useContext(TransactionContext)`, and
// // it's also where we guard against using the hook outside the provider.
// export function useTransactions() {
//   const context = useContext(TransactionContext)
//   if (context === undefined) {
//     throw new Error('useTransactions must be used within a TransactionProvider')
//   }
//   return context
// }









import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Receipt } from 'lucide-react'
import { useAuth } from './AuthContext'
import { isSessionExpiredError } from '../utils/authErrorHandling'
import {
  getTransactions,
  createTransaction,
  updateTransaction as updateTransactionApi,
  deleteTransaction as deleteTransactionApi,
} from '../api/transactionApi'

const TransactionContext = createContext(undefined)

const DEFAULT_ICON = {
  icon: Receipt,
  iconName: 'Receipt',
  iconBg: 'bg-slate-100 dark:bg-slate-500/10',
  iconColor: 'text-slate-600 dark:text-slate-400',
}

function mapBackendTransaction(backendTransaction) {
  const isoDate = backendTransaction.date
  const rawDate = isoDate.slice(0, 10)
  const displayDate = new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })

  return {
    id: backendTransaction._id,
    ...DEFAULT_ICON,
    title: backendTransaction.title,
    category: backendTransaction.category,
    date: displayDate,
    rawDate,
    amount: Number(backendTransaction.amount).toFixed(2),
    isPositive: backendTransaction.type === 'income',
  }
}

function buildBackendPayload(transaction) {
  return {
    title: transaction.title,
    amount: Number(transaction.amount),
    type: transaction.isPositive ? 'income' : 'expense',
    category: transaction.category,
    date: transaction.date,
  }
}

export function TransactionProvider({ children }) {
  const { token, isAuthenticated, logout } = useAuth()

  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadTransactions = useCallback(
    async (currentToken) => {
      setIsLoading(true)
      setError(null)

      try {
        const backendTransactions = await getTransactions(currentToken)
        setTransactions(backendTransactions.map(mapBackendTransaction))
      } catch (fetchError) {
        // V6.12 — a 401 here means the token this request was sent
        // with is no longer valid (expired, tampered, or the backend
        // rejected it for any other auth reason). That's different
        // from an ordinary fetch failure: instead of showing "couldn't
        // load your transactions" with a Retry button that would just
        // fail again with the same dead token, the session is treated
        // as invalid and the user is signed out — ProtectedRoute then
        // redirects to /login on its own once isAuthenticated flips.
        if (isSessionExpiredError(fetchError)) {
          logout()
          return
        }
        setTransactions([])
        setError(fetchError.message)
      } finally {
        setIsLoading(false)
      }
    },
    [logout]
  )

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setTransactions([])
      setIsLoading(false)
      setError(null)
      return
    }

    let isCancelled = false

    async function run() {
      setIsLoading(true)
      setError(null)

      try {
        const backendTransactions = await getTransactions(token)
        if (!isCancelled) {
          setTransactions(backendTransactions.map(mapBackendTransaction))
        }
      } catch (fetchError) {
        if (!isCancelled) {
          if (isSessionExpiredError(fetchError)) {
            logout()
            return
          }
          setTransactions([])
          setError(fetchError.message)
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    run()

    return () => {
      isCancelled = true
    }
  }, [isAuthenticated, token, logout])

  async function refetch() {
    if (!token) return
    await loadTransactions(token)
  }

  async function addTransaction(newTransactionData) {
    try {
      const payload = buildBackendPayload(newTransactionData)
      const createdTransaction = await createTransaction(payload, token)
      const mappedTransaction = mapBackendTransaction(createdTransaction)
      setTransactions((prev) => [mappedTransaction, ...prev])
      return mappedTransaction
    } catch (submitError) {
      // Writes (create/update/delete) previously had no catch block
      // at all here — a failure just propagated to whichever modal
      // called this, which is exactly right for an ordinary
      // validation/network failure (the modal shows it as a form
      // error). A 401 is different: the modal is about to be swept
      // away by the redirect this triggers, so there's nothing useful
      // to show in it — logout() fires and the error is NOT re-thrown
      // for this one case. Every other error still re-throws
      // unchanged, so existing modal error-display behavior is fully
      // preserved for anything that isn't a session failure.
      if (isSessionExpiredError(submitError)) {
        logout()
        return
      }
      throw submitError
    }
  }

  async function updateTransaction(updatedTransactionData) {
    try {
      const payload = buildBackendPayload(updatedTransactionData)
      const updatedFromBackend = await updateTransactionApi(
        updatedTransactionData.id,
        payload,
        token
      )
      const mappedTransaction = mapBackendTransaction(updatedFromBackend)
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === mappedTransaction.id ? mappedTransaction : transaction
        )
      )
      return mappedTransaction
    } catch (submitError) {
      if (isSessionExpiredError(submitError)) {
        logout()
        return
      }
      throw submitError
    }
  }

  async function deleteTransaction(id) {
    try {
      await deleteTransactionApi(id, token)
      setTransactions((prev) => prev.filter((transaction) => transaction.id !== id))
    } catch (submitError) {
      if (isSessionExpiredError(submitError)) {
        logout()
        return
      }
      throw submitError
    }
  }

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        isLoading,
        error,
        refetch,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionContext)
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider')
  }
  return context
}