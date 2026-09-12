// import { createContext, useContext, useState, useEffect } from 'react'
// import { useAuth } from './AuthContext'
// import { getSettings, updateSettings as updateSettingsApi } from '../api/settingsApi'

// const SettingsContext = createContext(undefined)

// export function SettingsProvider({ children }) {
//   const { token, isAuthenticated } = useAuth()

//   const [settings, setSettings] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)

//   // Settings are user-specific, so this reacts to authentication
//   // exactly the way TransactionContext does: fetch when a user
//   // becomes authenticated, clear immediately on logout so a second
//   // person on the same browser never sees the previous user's
//   // settings, even briefly.
//   useEffect(() => {
//     if (!isAuthenticated || !token) {
//       setSettings(null)
//       setIsLoading(false)
//       setError(null)
//       return
//     }

//     // Guards against a stale response overwriting state if the user
//     // logs out (or switches accounts) while a fetch is still in
//     // flight — same reasoning as TransactionContext's loadTransactions.
//     let isCancelled = false

//     async function loadSettings() {
//       setIsLoading(true)
//       setError(null)

//       try {
//         const backendSettings = await getSettings(token)
//         if (!isCancelled) {
//           setSettings(backendSettings)
//         }
//       } catch (fetchError) {
//         if (!isCancelled) {
//           setSettings(null)
//           setError(fetchError.message)
//         }
//       } finally {
//         if (!isCancelled) {
//           setIsLoading(false)
//         }
//       }
//     }

//     loadSettings()

//     return () => {
//       isCancelled = true
//     }
//   }, [isAuthenticated, token])

//   // Preserves the existing "changes are applied immediately" UX: every
//   // call sends the full updated settings object to the backend right
//   // away. React state is updated only after the backend confirms the
//   // change — consistent with how addTransaction/updateTransaction work
//   // in TransactionContext, so a failed save doesn't silently pretend
//   // to have succeeded.
//   async function updateSetting(key, value) {
//     const updatedData = { ...settings, [key]: value }
//     const savedSettings = await updateSettingsApi(updatedData, token)
//     setSettings(savedSettings)
//   }

//   return (
//     <SettingsContext.Provider value={{ settings, updateSetting, isLoading, error }}>
//       {children}
//     </SettingsContext.Provider>
//   )
// }

// export function useSettings() {
//   const context = useContext(SettingsContext)
//   if (context === undefined) {
//     throw new Error('useSettings must be used within a SettingsProvider')
//   }
//   return context
// }










import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { getSettings, updateSettings as updateSettingsApi } from '../api/settingsApi'
import { formatCurrency } from '../utils/currency'
import { isSessionExpiredError } from '../utils/authErrorHandling'

const SettingsContext = createContext(undefined)

export function SettingsProvider({ children }) {
  const { token, isAuthenticated, logout } = useAuth()

  const [settings, setSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setSettings(null)
      setIsLoading(false)
      setError(null)
      return
    }

    let isCancelled = false

    async function loadSettings() {
      setIsLoading(true)
      setError(null)

      try {
        const backendSettings = await getSettings(token)
        if (!isCancelled) {
          setSettings(backendSettings)
        }
      } catch (fetchError) {
        if (!isCancelled) {
          // V6.12 — same reasoning as TransactionContext/BudgetContext:
          // a 401 means the session itself is invalid, not that this
          // particular request failed — sign out and let ProtectedRoute
          // redirect, rather than surfacing a Retry button that would
          // just fail again with the same dead token.
          if (isSessionExpiredError(fetchError)) {
            logout()
            return
          }
          setSettings(null)
          setError(fetchError.message)
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadSettings()

    return () => {
      isCancelled = true
    }
  }, [isAuthenticated, token, logout])

  async function refetch() {
    if (!token) return

    setIsLoading(true)
    setError(null)

    try {
      const backendSettings = await getSettings(token)
      setSettings(backendSettings)
    } catch (fetchError) {
      if (isSessionExpiredError(fetchError)) {
        logout()
        return
      }
      setSettings(null)
      setError(fetchError.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function updateSetting(key, value) {
    try {
      const updatedData = { ...settings, [key]: value }
      const savedSettings = await updateSettingsApi(updatedData, token)
      setSettings(savedSettings)
    } catch (submitError) {
      // Same pattern as the write operations in TransactionContext/
      // BudgetContext: a 401 triggers logout and is swallowed rather
      // than re-thrown, since Settings.jsx's own save-error UI is
      // about to be redirected away regardless. Every other error
      // still re-throws unchanged, so Settings.jsx's existing
      // save-error display (and the V6.11-C race-condition fix built
      // around it) is completely unaffected for anything that isn't a
      // session failure.
      if (isSessionExpiredError(submitError)) {
        logout()
        return
      }
      throw submitError
    }
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, isLoading, error, refetch }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

// A small convenience hook, not a new Context — currency has no DOM
// side effect and no preference/resolved-value distinction the way
// theme does, so it doesn't need its own provider. This just saves
// every consuming component from repeating the same
// `settings?.currency || 'USD'` fallback before calling
// formatCurrency(). The underlying preference is still owned
// entirely by `settings` above; this hook derives from it on every
// render rather than caching its own copy, so it never goes stale
// and never becomes a second source of truth.
export function useCurrencyFormatter() {
  const { settings } = useSettings()
  const currencyCode = settings?.currency || 'USD'

  return useCallback(
    (amount, options) => formatCurrency(amount, currencyCode, options),
    [currencyCode]
  )
}