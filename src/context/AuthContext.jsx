// import { createContext, useContext, useState, useEffect } from 'react'
// import { registerUser, loginUser } from '../api/authApi'

// const AuthContext = createContext(undefined)

// const TOKEN_KEY = 'personal-finance-token'
// const USER_KEY = 'personal-finance-user'

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null)
//   const [token, setToken] = useState(null)

//   // isLoading now means something more specific than before: "have we
//   // finished checking Local Storage for an existing session yet."
//   // Defaulting to true is the critical detail here — without it, the
//   // very first render would already claim initialization is complete
//   // while isAuthenticated is still false (because the restore effect
//   // hasn't run yet), and ProtectedRoute would incorrectly redirect an
//   // already-logged-in user to /login for one render before snapping
//   // back. Starting at true means ProtectedRoute knows to wait.
//   const [isLoading, setIsLoading] = useState(true)

//   // Effect 1: runs once on mount. Restores a previous session (token +
//   // user) from Local Storage, if one exists — this is what lets a
//   // logged-in user refresh the page without being logged out.
//   useEffect(() => {
//     const savedToken = localStorage.getItem(TOKEN_KEY)
//     const savedUser = localStorage.getItem(USER_KEY)

//     if (savedToken && savedUser) {
//       setToken(savedToken)
//       setUser(JSON.parse(savedUser))
//     }

//     // Only now — after we've actually checked — do we consider
//     // initialization complete. Before this line runs, isLoading stays
//     // true, which is exactly what ProtectedRoute needs to avoid an
//     // incorrect redirect.
//     setIsLoading(false)
//   }, [])

//   // Effect 2: keeps Local Storage in sync whenever token/user change,
//   // but only after the initial load has finished — same reasoning as
//   // before, just now driven by isLoading instead of a separate flag.
//   useEffect(() => {
//     if (isLoading) return

//     if (token && user) {
//       localStorage.setItem(TOKEN_KEY, token)
//       localStorage.setItem(USER_KEY, JSON.stringify(user))
//     } else {
//       localStorage.removeItem(TOKEN_KEY)
//       localStorage.removeItem(USER_KEY)
//     }
//   }, [token, user, isLoading])

//   async function register(name, email, password) {
//     const data = await registerUser(name, email, password)
//     return data
//   }

//   async function login(email, password) {
//     const data = await loginUser(email, password)
//     setToken(data.token)
//     setUser(data.user)
//     return data
//   }

//   function logout() {
//     setToken(null)
//     setUser(null)
//   }

//   const isAuthenticated = Boolean(token && user)

//   return (
//     <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, register, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }











import { createContext, useContext, useState, useEffect } from 'react'
import { registerUser, loginUser } from '../api/authApi'

const AuthContext = createContext(undefined)

const TOKEN_KEY = 'personal-finance-token'
const USER_KEY = 'personal-finance-user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY)
    const savedUser = localStorage.getItem(USER_KEY)

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (isLoading) return

    if (token && user) {
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  }, [token, user, isLoading])

  // V6.12 — the backend's register endpoint now returns a token in
  // the same response login already produces, so this no longer
  // needs a caller (Register.jsx) to make a second, separate login()
  // call right after registering. That second call was the entire
  // reason a "registered but the follow-up sign-in failed" edge case
  // could exist — register() now behaves symmetrically with login():
  // one call, one round trip, session established immediately.
  async function register(name, email, password) {
    const data = await registerUser(name, email, password)
    setToken(data.token)
    setUser(data.user)
    return data
  }

  async function login(email, password) {
    const data = await loginUser(email, password)
    setToken(data.token)
    setUser(data.user)
    return data
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  const isAuthenticated = Boolean(token && user)

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}