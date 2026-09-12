import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// This is the ONE place authentication is checked for protected pages
// — individual pages (Dashboard, Transactions, etc.) never need their
// own auth check, because they can only ever be reached through this
// wrapper in the route tree.
function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  // While AuthContext is still checking Local Storage for an existing
  // session, we don't yet know whether the user is authenticated or
  // not — redirecting here would be a guess, and a wrong one on every
  // refresh for an already-logged-in user. Waiting avoids that.
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <p className="text-sm text-text-muted">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Outlet renders whichever nested route matched — this component
  // doesn't need to know what it's protecting, just whether it's
  // allowed to render it.
  return <Outlet />
}

export default ProtectedRoute