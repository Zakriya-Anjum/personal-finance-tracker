import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { isSessionExpiredError } from '../utils/authErrorHandling'
import {
  getBudgets,
  createBudget as createBudgetApi,
  updateBudget as updateBudgetApi,
  deleteBudget as deleteBudgetApi,
} from '../api/budgetApi'

const BudgetContext = createContext(undefined)

export function BudgetProvider({ children }) {
  const { token, isAuthenticated, logout } = useAuth()

  const [budgets, setBudgets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setBudgets([])
      setIsLoading(false)
      setError(null)
      return
    }

    let isCancelled = false

    async function loadBudgets() {
      setIsLoading(true)
      setError(null)
      try {
        const backendBudgets = await getBudgets(token)
        if (!isCancelled) setBudgets(backendBudgets)
      } catch (fetchError) {
        if (!isCancelled) {
          // V6.12 — see TransactionContext for the full reasoning:
          // a 401 means the session itself is no longer valid, not
          // that this particular fetch failed — sign out and let
          // ProtectedRoute redirect, instead of showing a Retry
          // button that would just fail the same way again.
          if (isSessionExpiredError(fetchError)) {
            logout()
            return
          }
          setBudgets([])
          setError(fetchError.message)
        }
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }

    loadBudgets()

    return () => {
      isCancelled = true
    }
  }, [isAuthenticated, token, logout])

  async function refetch() {
    if (!token) return
    setIsLoading(true)
    setError(null)
    try {
      const backendBudgets = await getBudgets(token)
      setBudgets(backendBudgets)
    } catch (fetchError) {
      if (isSessionExpiredError(fetchError)) {
        logout()
        return
      }
      setBudgets([])
      setError(fetchError.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function addBudget(budgetData) {
    try {
      const created = await createBudgetApi(budgetData, token)
      setBudgets((prev) => [...prev, created])
      return created
    } catch (submitError) {
      // Same reasoning as TransactionContext's write operations: a
      // 401 triggers logout and is swallowed rather than re-thrown
      // (the calling modal is about to be redirected away regardless);
      // every other error still re-throws exactly as before, so
      // existing modal error-display behavior is unchanged for
      // anything that isn't a session failure.
      if (isSessionExpiredError(submitError)) {
        logout()
        return
      }
      throw submitError
    }
  }

  async function updateBudget(id, budgetData) {
    try {
      const updated = await updateBudgetApi(id, budgetData, token)
      setBudgets((prev) => prev.map((budget) => (budget._id === id ? updated : budget)))
      return updated
    } catch (submitError) {
      if (isSessionExpiredError(submitError)) {
        logout()
        return
      }
      throw submitError
    }
  }

  async function deleteBudget(id) {
    try {
      await deleteBudgetApi(id, token)
      setBudgets((prev) => prev.filter((budget) => budget._id !== id))
    } catch (submitError) {
      if (isSessionExpiredError(submitError)) {
        logout()
        return
      }
      throw submitError
    }
  }

  return (
    <BudgetContext.Provider
      value={{ budgets, addBudget, updateBudget, deleteBudget, isLoading, error, refetch }}
    >
      {children}
    </BudgetContext.Provider>
  )
}

export function useBudgets() {
  const context = useContext(BudgetContext)
  if (context === undefined) {
    throw new Error('useBudgets must be used within a BudgetProvider')
  }
  return context
}