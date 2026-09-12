import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// The inverse of ProtectedRoute: this is the ONE place that decides
// whether an already-authenticated user should be kept off
// public-only routes like /login and /register. Structured
// symmetrically with ProtectedRoute — same isLoading wait, same
// single-decision-point principle — rather than duplicating an
// isAuthenticated check inside Login.jsx and Register.jsx separately.
function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  // Same reasoning as ProtectedRoute: while AuthContext is still
  // checking Local Storage for an existing session, we don't yet know
  // whether the user is authenticated — rendering the guest page (or
  // redirecting away from it) before that's known risks a flash of
  // the wrong screen for an already-logged-in user refreshing while
  // sitting on /login.
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <p className="text-sm text-text-muted">Loading...</p>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default GuestRoute